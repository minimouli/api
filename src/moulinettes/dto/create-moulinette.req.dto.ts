/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsBoolean, IsString, IsUrl } from 'class-validator'

class CreateMoulinetteReqDto {

    @ApiProperty()
    @IsString()
    project: string

    @ApiProperty()
    @IsString()
    @IsUrl()
    repository: string

    @ApiProperty()
    @IsArray()
    @IsString({
        each: true
    })
    @ArrayNotEmpty()
    maintainers: string[]

    @ApiProperty()
    @IsBoolean()
    isOfficial: boolean

}

export {
    CreateMoulinetteReqDto
}
