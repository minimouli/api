/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { EntityType } from '../../common/enums/entity-type.enum'

class AuthTokenDto {

    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    lastActive: string

    @ApiProperty()
    expiresAt: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    object: EntityType

}

export {
    AuthTokenDto
}
