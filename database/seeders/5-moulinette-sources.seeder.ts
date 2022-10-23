/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MoulinetteSource } from '../../src/moulinettes/entities/moulinette-source.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class MoulinetteSourcesSeeder implements MigrationInterface {

    public name = 'MoulinetteSourcesSeeder'

    public up(): Promise<void> {
        return Promise.resolve()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(MoulinetteSource)
            .execute()
    }

}

export {
    MoulinetteSourcesSeeder
}
