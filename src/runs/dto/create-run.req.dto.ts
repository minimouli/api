/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString, Matches, ValidateNested } from 'class-validator'
import { SuiteDto } from './suite.dto'

class CreateRunReqDto {

    @ApiProperty()
    @IsString()
    @Matches(/^[\dA-Za-z]+@\d+\.\d+\.\d+$/)
    moulinette: string

    @ApiProperty({
        type: [SuiteDto]
    })
    @Type(() => SuiteDto)
    @IsArray()
    @ValidateNested()
    suites: SuiteDto[]

}

export {
    CreateRunReqDto
}
