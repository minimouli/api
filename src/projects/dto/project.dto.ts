/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { EntityType } from '../../common/enums/entity-type.enum'
import { OrganizationDto } from '../../organizations/dto/organization.dto'
import { Organization } from '../../organizations/entities/organization.entity'

class ProjectDto {

    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    displayName: string

    @ApiProperty()
    cycle: number

    @ApiProperty({
        type: OrganizationDto
    })
    organization: Organization

    @ApiProperty()
    uri: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    object: EntityType

}

export {
    ProjectDto
}
