/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GithubCredentials } from '../../src/auth/entities/github-credentials.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class GithubCredentialsSeeder implements MigrationInterface {

    public name = 'GithubCredentialsSeeder'

    public up(): Promise<void> {
        return Promise.resolve()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(GithubCredentials)
            .execute()
    }

}

export {
    GithubCredentialsSeeder
}
