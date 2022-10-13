/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokensController } from './tokens.controller'
import { TokensService } from './tokens.service'
import { AuthToken } from './entities/auth-token.entity'
import { CaslModule } from '../casl/casl.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthToken]),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET')
            }),
            inject: [ConfigService]
        }),
        CaslModule
    ],
    controllers: [TokensController],
    providers: [TokensService],
    exports: [TokensService]
})
class TokensModule {}

export {
    TokensModule
}
