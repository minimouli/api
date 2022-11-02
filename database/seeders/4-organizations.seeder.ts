/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Organization } from '../../src/organizations/entities/organization.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class OrganizationsSeeder implements MigrationInterface {

    public name = 'OrganizationsSeeder'

    public up(): Promise<void> {
        return Promise.resolve()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(Organization)
            .execute()
    }

}

export {
    OrganizationsSeeder
}
