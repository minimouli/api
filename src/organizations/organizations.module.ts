/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'
import { Organization } from './entities/organization.entity'
import { CaslModule } from '../casl/casl.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Organization]),
        CaslModule
    ],
    controllers: [OrganizationsController],
    providers: [OrganizationsService]
})
class OrganizationsModule {}

export {
    OrganizationsModule
}
