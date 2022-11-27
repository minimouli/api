/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

class SignupWithGitHubAccessTokenReqDto {

    @ApiProperty()
    @IsString()
    accessToken: string

    @ApiProperty()
    @IsString()
    @MaxLength(64)
    authTokenName: string

}

export {
    SignupWithGitHubAccessTokenReqDto
}
