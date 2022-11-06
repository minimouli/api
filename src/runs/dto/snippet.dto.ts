/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'

class SnippetArgumentsDto {

    @ApiProperty({
        type: [String]
    })
    received: string[]

    @ApiProperty({
        type: [String]
    })
    expected: string[]

}

class SnippetDto {

    @ApiProperty({
        type: SnippetArgumentsDto
    })
    arguments: SnippetArgumentsDto

    @ApiProperty()
    method: string

}

export {
    SnippetDto
}
