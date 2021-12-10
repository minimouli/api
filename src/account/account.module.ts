/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import AccountService from './account.service'
import Account, { AccountSchema } from './schemas/account.schema'

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Account.name,
            schema: AccountSchema
        }])
    ],
    providers: [AccountService],
    exports: [AccountService]
})
class AccountModule {}

export default AccountModule
