/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

class GetAuthTokensQueryDto {

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

}

export {
    GetAuthTokensQueryDto
}
