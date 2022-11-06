/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsObject, IsOptional, IsString, Length } from 'class-validator'
import { HintDto } from './hint.dto'

enum TestStatus {
    Success = 'Status.Success',
    Failure = 'Status.Failure'
}

class TestDto {

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    name: string

    @ApiProperty()
    @IsEnum(TestStatus)
    status: TestStatus

    @ApiProperty()
    @IsNumber()
    duration: number

    @ApiProperty({
        type: HintDto,
        required: false
    })
    @IsOptional()
    @Type(() => HintDto)
    @IsObject()
    hint?: HintDto

}

export {
    TestDto
}
