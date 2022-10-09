/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsService } from './accounts.service'
import { Account } from './entities/account.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Account])
    ],
    providers: [AccountsService],
    exports: [AccountsService]
})
class AccountsModule {}

export {
    AccountsModule
}
