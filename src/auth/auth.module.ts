/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import AuthController from './auth.controller'
import AuthService from './auth.service'
import Credentials, { CredentialsSchema } from './schemas/credentials.schema'
import AccountModule from '../account/account.module'

@Module({
    imports: [
        AccountModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '60 days'
                }
            }),
            inject: [ConfigService]
        }),
        MongooseModule.forFeature([{
            name: Credentials.name,
            schema: CredentialsSchema
        }])
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
class AuthModule {}

export default AuthModule
