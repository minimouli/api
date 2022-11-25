/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import ms from 'ms'
import { LessThanOrEqual, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { AuthToken } from './entities/auth-token.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { PagingResult } from 'typeorm-cursor-pagination'
import type { JwtApplicationPayload } from './types/jwt.type'
import type { GetAuthTokensQueryDto } from './dto/get-auth-tokens.query.dto'

@Injectable()
class TokensService {

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(AuthToken)
        private readonly authTokenRepository: Repository<AuthToken>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    async create(name: string, account: Account): Promise<[AuthToken, string]> {

        const expiresAt = this.getExpirationDate()

        const authToken = await this.createAuthToken(name, account, expiresAt)
        const jwt = this.createJwt(authToken, expiresAt)

        return [authToken, jwt]
    }

    async listAuthTokensFromAccountId(ownerId: string, query: GetAuthTokensQueryDto, initiator: Account): Promise<PagingResult<AuthToken>> {

        const owner = await this.accountRepository.findOneBy({ id: ownerId })

        if (owner === null)
            throw new NotFoundException()

        const ability = this.caslAbilityFactory.createForAccount(initiator)
        const queryBuilder = this.authTokenRepository.createQueryBuilder('authToken')
            .where('authToken.account.id = :ownerId', { ownerId })
            .leftJoinAndSelect('authToken.account', 'account')

        const paginator = buildPaginator({
            entity: AuthToken,
            paginationKeys: ['id'],
            alias: 'authToken',
            query
        })

        const result = await paginator.paginate(queryBuilder)

        for (const authToken of result.data)
            if (!ability.can(CaslAction.Read, authToken))
                throw new ForbiddenException()

        return result
    }

    async deleteAuthTokenById(subjectId: string, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)
        const authToken = await this.authTokenRepository.findOne({
            where: {
                id: subjectId
            },
            relations: ['account']
        })

        if (authToken === null)
            throw new NotFoundException()

        if (!ability.can(CaslAction.Delete, authToken))
            throw new ForbiddenException()

        await this.authTokenRepository.remove(authToken)
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleRemoveExpiredAuthTokens(): Promise<void> {
         await this.authTokenRepository.delete({
            expiresAt: LessThanOrEqual(new Date().toISOString())
        })
    }

    private createAuthToken(name: string, account: Account, expiresAt: Date): Promise<AuthToken> {

        const authToken = this.authTokenRepository.create({
            name,
            account,
            expiresAt: expiresAt.toISOString()
        })

        return this.authTokenRepository.save(authToken)
    }

    private createJwt(authToken: AuthToken, expiresAt: Date): string {

        const payload: JwtApplicationPayload = {
            jti: authToken.id,
            sub: authToken.account.id
        }

        return this.jwtService.sign(payload, {
            expiresIn: ms(expiresAt.getTime() - Date.now())
        })
    }

    private getExpirationDate(): Date {
        const expiresIn = ms(this.configService.get<string>('JWT_OPTION_EXPIRES_IN') ?? '1h')
        return new Date(Date.now() + expiresIn)
    }

}

export {
    TokensService
}
