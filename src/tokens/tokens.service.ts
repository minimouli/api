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
import { AuthToken } from './entities/auth-token.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { JwtApplicationPayload } from './types/jwt.type'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class TokensService {

    constructor(
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

    async getAllAuthTokensOf(ownerId: string, initiator: Account): Promise<AuthToken[]> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)
        const authTokens = await this.authTokenRepository.find({
            where: {
                account: {
                    id: ownerId
                }
            },
            relations: ['account']
        })

        for (const authToken of authTokens)
            if (!ability.can(CaslAction.Read, authToken))
                throw new ForbiddenException()

        return authTokens
    }

    async deleteAuthToken(authTokenId: string, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)
        const authToken = await this.authTokenRepository.findOne({
            where: {
                id: authTokenId
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
