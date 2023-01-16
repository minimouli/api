/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

class GetMoulinettesQueryDto {

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => Number.parseInt(String(value)))
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 20

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    beforeCursor?: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    afterCursor?: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => String(value) === 'true')
    @IsBoolean()
    isOfficial?: boolean

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    projectName?: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => Number.parseInt(String(value)))
    @IsInt()
    projectCycle?: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    organizationName?: string

}

export {
    GetMoulinettesQueryDto
}
