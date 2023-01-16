/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GitHubCredentials } from '../../src/auth/entities/github-credentials.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class GitHubCredentialsSeeder implements MigrationInterface {

    public name = 'GitHubCredentialsSeeder'

    public up(): Promise<void> {
        return Promise.resolve()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(GitHubCredentials)
            .execute()
    }

}

export {
    GitHubCredentialsSeeder
}
