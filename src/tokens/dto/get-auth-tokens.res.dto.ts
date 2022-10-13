/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { AuthTokenDto } from './auth-token.dto'

class GetAuthTokensResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: [AuthTokenDto]
    })
    data: AuthTokenDto[]

}

export {
    GetAuthTokensResDto
}
