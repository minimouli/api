/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Project } from '../../src/projects/entities/project.entity'
import type { MigrationInterface, QueryRunner } from 'typeorm'

class ProjectsSeeder implements MigrationInterface {

    public name = 'ProjectsSeeder'

    public up(): Promise<void> {
        return Promise.resolve()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(Project)
            .execute()
    }

}

export {
    ProjectsSeeder
}
