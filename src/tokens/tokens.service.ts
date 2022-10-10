/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import ms from 'ms'
import { Repository } from 'typeorm'
import { AuthToken } from './entities/auth-token.entity'
import type { JwtApplicationPayload } from './types/jwt.type'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class TokensService {

    constructor(
        @InjectRepository(AuthToken)
        private readonly authTokenRepository: Repository<AuthToken>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    async create(name: string, account: Account): Promise<[AuthToken, string]> {

        const expiresAt = this.getExpirationDate()

        const authToken = await this.createAuthToken(name, account, expiresAt)
        const jwt = this.createJwt(authToken, expiresAt)

        return [authToken, jwt]
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
