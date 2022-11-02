/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

class CreateOrganizationReqDto {

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    name: string

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    displayName: string

}

export {
    CreateOrganizationReqDto
}
