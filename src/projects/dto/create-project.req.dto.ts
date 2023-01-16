/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, Length } from 'class-validator'

class CreateProjectReqDto {

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    name: string

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    displayName: string

    @ApiProperty()
    @IsNumber()
    cycle: number

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    organization: string

}

export {
    CreateProjectReqDto
}
