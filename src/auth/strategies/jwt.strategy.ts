/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { Account } from '../../accounts/entities/account.entity'
import { AuthToken } from '../../tokens/entities/auth-token.entity'
import type { JwtPayload } from '../../tokens/types/jwt.type'

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(AuthToken)
        private readonly authTokenRepository: Repository<AuthToken>,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET')
        })
    }

    async validate(payload: JwtPayload): Promise<Account> {

        const account = await this.accountRepository.findOneBy({ id: payload.sub })
        const authToken = await this.authTokenRepository.findOneBy({ id: payload.jti })

        if (account === null || authToken === null)
            throw new UnauthorizedException()

        authToken.lastActive = new Date().toISOString()
        await this.authTokenRepository.save(authToken)

        return account
    }

}

export {
    JwtStrategy
}
