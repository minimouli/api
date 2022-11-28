/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { AuthTokenDto } from './auth-token.dto'

class GetAuthTokensDataResDto {

    @ApiProperty()
    object: string

    @ApiProperty({
        type: [AuthTokenDto]
    })
    items: AuthTokenDto[]

    @ApiProperty({
        type: String,
        nullable: true
    })
    beforeCursor: string | null

    @ApiProperty({
        type: String,
        nullable: true
    })
    afterCursor: string | null

}

class GetAuthTokensResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: GetAuthTokensDataResDto
    })
    data: GetAuthTokensDataResDto

}

export {
    GetAuthTokensResDto
}
