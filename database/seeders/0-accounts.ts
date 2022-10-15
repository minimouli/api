/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { faker } from '@faker-js/faker'
import { Account } from '../../src/accounts/entities/account.entity'
import { Permission } from '../../src/common/enums/permission.enum'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class AccountsSeeder implements MigrationInterface {

    public name = 'AccountsSeeder'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(Account)
            .values([
                {
                    id: 'admin',
                    nickname: faker.name.firstName(),
                    username: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    permissions: [
                        Permission.ReadAllAccounts,
                        Permission.ReadAllAuthTokens,
                        Permission.DeleteAllAuthTokens
                    ]
                },
                {
                    id: 'user-1',
                    nickname: faker.name.firstName(),
                    username: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    permissions: []
                },
                {
                    id: 'user-2',
                    nickname: faker.name.firstName(),
                    username: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    permissions: [
                        Permission.ReadOwnAuthTokens,
                        Permission.DeleteOwnAuthTokens
                    ]
                }
            ])
            .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(Account)
            .execute()
    }

}

export {
    AccountsSeeder
}
