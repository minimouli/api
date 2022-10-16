/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

class CreateAccountReqDto {

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    nickname: string

    @ApiProperty()
    @IsString()
    @Length(2, 32)
    username: string

}

export {
    CreateAccountReqDto
}
