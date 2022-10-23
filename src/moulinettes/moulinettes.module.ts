/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MoulinettesController } from './moulinettes.controller'
import { MoulinettesService } from './moulinettes.service'
import { Moulinette } from './entities/moulinette.entity'
import { MoulinetteSource } from './entities/moulinette-source.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslModule } from '../casl/casl.module'
import { Project } from '../projects/entities/project.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, Moulinette, MoulinetteSource, Project]),
        CaslModule
    ],
    controllers: [MoulinettesController],
    providers: [MoulinettesService]
})
class MoulinettesModule {}

export {
    MoulinettesModule
}
