/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { EntityType } from '../../common/enums/entity-type.enum'

class AccountDto {

    @ApiProperty()
    id: string

    @ApiProperty()
    nickname: string

    @ApiProperty()
    username: string

    @ApiProperty()
    email: string

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
    AccountDto
}
