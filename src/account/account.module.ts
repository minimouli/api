/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import AccountController from './account.controller'
import AccountService from './account.service'
import Account, { AccountSchema } from './schemas/account.schema'
import JwtStrategy from '../auth/strategies/jwt.strategy'

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Account.name,
            schema: AccountSchema
        }])
    ],
    controllers: [AccountController],
    providers: [AccountService, JwtStrategy],
    exports: [AccountService]
})
class AccountModule {}

export default AccountModule
