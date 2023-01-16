/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'

class ErrorResDto {

    @ApiProperty()
    status: 'failure'

    @ApiProperty()
    statusCode: number

    @ApiProperty()
    error: string

    @ApiProperty({
        type: String
    })
    message: string | string[]

    @ApiProperty()
    timestamp: string

    @ApiProperty()
    path: string

    @ApiProperty()
    method: string

}

export {
    ErrorResDto
}
