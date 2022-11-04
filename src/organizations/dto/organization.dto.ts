/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { EntityType } from '../../common/enums/entity-type.enum'

class OrganizationDto {

    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    displayName: string

    @ApiProperty()
    uri: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    type: EntityType

}

export {
    OrganizationDto
}
