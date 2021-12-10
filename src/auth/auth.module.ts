/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import AuthController from './auth.controller'
import AuthService from './auth.service'
import Credentials, { CredentialsSchema } from './schemas/credentials.schema'
import AccountModule from '../account/account.module'

@Module({
    imports: [
        AccountModule,
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
