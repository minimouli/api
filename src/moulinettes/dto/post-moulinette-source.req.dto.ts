/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsString, IsUrl } from 'class-validator'

class PostMoulinetteSourceReqDto {

    @ApiProperty()
    @IsString()
    @IsUrl()
    tarball: string

    @ApiProperty()
    @IsArray()
    @IsString({
        each: true
    })
    rules: string[]

    @ApiProperty()
    @IsBoolean()
    isDeprecated: boolean

}

export {
    PostMoulinetteSourceReqDto
}
