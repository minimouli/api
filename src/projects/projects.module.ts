/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { Project } from './entities/project.entity'
import { CaslModule } from '../casl/casl.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        CaslModule
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService]
})
class ProjectsModule {}

export {
    ProjectsModule
}
