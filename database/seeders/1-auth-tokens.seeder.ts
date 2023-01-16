/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { faker } from '@faker-js/faker'
import { Account } from '../../src/accounts/entities/account.entity'
import { AuthToken } from '../../src/tokens/entities/auth-token.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class AuthTokensSeeder implements MigrationInterface {

    public name = 'AuthTokensSeeder'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const queryBuilder = queryRunner.manager.createQueryBuilder()

        const accounts = await queryBuilder
            .select('account')
            .from(Account, 'account')
            .getMany()

        await queryBuilder
            .insert()
            .into(AuthToken)
            .values(accounts.map((account) => ({
                id: `${account.id}-auth-token`,
                name: faker.internet.userAgent(),
                account,
                lastActive: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 86_400_000).toISOString()
            })))
            .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(AuthToken)
            .execute()
    }

}

export {
    AuthTokensSeeder
}
