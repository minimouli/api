/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
    sub: string
}

type FullJwtPayload = JwtPayload & {
    iat: number,
    exp: number
}

type ValidUser = {
    accountUuid: string
}

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        })
    }

    async validate(payload: FullJwtPayload): Promise<ValidUser> {
        return {
            accountUuid: payload.sub
        }
    }

}

export default JwtStrategy
export {
    JwtPayload,
    ValidUser
}
