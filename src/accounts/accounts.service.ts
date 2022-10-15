/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account } from './entities/account.entity'
import { Permission } from '../common/enums/permission.enum'
import { getRandomString, LOWER_CASE_ALPHA, NUMERIC } from '../common/helpers/random.helper'

const defaultPermissions = [
    Permission.ReadOwnAuthTokens,
    Permission.DeleteOwnAuthTokens
]

@Injectable()
class AccountsService {

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ) {}

    async create(nickname: string, email: string, permissions = defaultPermissions): Promise<Account> {

        const account = this.accountRepository.create({
            username: getRandomString(16, `${LOWER_CASE_ALPHA}${NUMERIC}`),
            nickname,
            email,
            permissions
        })

        return this.accountRepository.save(account)
    }

}

export {
    AccountsService
}
