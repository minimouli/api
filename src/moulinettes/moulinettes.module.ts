/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MoulinettesController } from './moulinettes.controller'
import { MoulinettesService } from './moulinettes.service'
import { Moulinette } from './entities/moulinette.entity'
import { MoulinetteSource } from './entities/moulinette-source.entity'
import { MoulinetteSourcesService } from './services/moulinette-sources.service'
import { Account } from '../accounts/entities/account.entity'
import { CaslModule } from '../casl/casl.module'
import { Project } from '../projects/entities/project.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, Moulinette, MoulinetteSource, Project]),
        CaslModule,
        HttpModule
    ],
    controllers: [MoulinettesController],
    providers: [
        MoulinettesService,
        MoulinetteSourcesService
    ]
})
class MoulinettesModule {}

export {
    MoulinettesModule
}
