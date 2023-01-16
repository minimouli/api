/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Moulinette } from '../../src/moulinettes/entities/moulinette.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class MoulinettesSeeder implements MigrationInterface {

    public name = 'MoulinettesSeeder'

    public up(): Promise<void> {
        return Promise.resolve()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(Moulinette)
            .execute()
    }

}

export {
    MoulinettesSeeder
}
