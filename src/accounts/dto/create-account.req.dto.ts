/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsEnum, IsString, IsUrl, Length } from 'class-validator'
import { Permission } from '../../common/enums/permission.enum'

class CreateAccountReqDto {

    @ApiProperty()
    @IsString()
    @Length(1, 32)
    nickname: string

    @ApiProperty()
    @IsString()
    @Length(2, 32)
    username: string

    @ApiProperty()
    @IsUrl()
    @Length(1, 64)
    avatar: string

    @ApiProperty()
    @IsEmail()
    @Length(1, 32)
    email: string

    @ApiProperty({
        type: [Permission]
    })
    @IsArray()
    @IsEnum(Permission, {
        each: true
    })
    permissions: Permission[]

}

export {
    CreateAccountReqDto
}
