/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString, Length, ValidateNested } from 'class-validator'
import { TestDto } from './test.dto'

class SuiteDto {

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    name: string

    @ApiProperty({
        type: [SuiteDto]
    })
    @Type(() => SuiteDto)
    @IsArray()
    @ValidateNested()
    suites: SuiteDto[]

    @ApiProperty({
        type: [TestDto]
    })
    @Type(() => TestDto)
    @IsArray()
    @ValidateNested()
    tests: TestDto[]

}

export {
    SuiteDto
}
