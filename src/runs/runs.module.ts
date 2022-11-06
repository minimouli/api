/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RunsController } from './runs.controller'
import { RunsService } from './runs.service'
import { Run } from './entities/run.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslModule } from '../casl/casl.module'
import { Moulinette } from '../moulinettes/entities/moulinette.entity'
import { MoulinetteSource } from '../moulinettes/entities/moulinette-source.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, Moulinette, MoulinetteSource, Run]),
        CaslModule
    ],
    controllers: [RunsController],
    providers: [RunsService]
})
class RunsModule {}

export {
    RunsModule
}
