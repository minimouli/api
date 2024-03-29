/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { SnippetDto } from './snippet.dto'

enum HintType {
    Comparison = 'HintType.Comparison',
    Equality = 'HintType.Equality',
    StreamDifference = 'HintType.StreamDifference',
    StringDifference = 'HintType.StringDifference',
    Timeout = 'HintType.Timeout',
    MatcherError = 'HintType.MatcherError'
}

enum HintStatus {
    Success = 'Status.Success',
    Failure = 'Status.Failure'
}

enum HintCategory {
    Output = 'Category.Output',
    ExitCode = 'Category.ExitCode',
    Timeout = 'Category.Timeout'
}

class HintDto {

    @ApiProperty()
    type: HintType

    @ApiProperty()
    status: HintStatus

    @ApiProperty({
        required: false
    })
    category?: HintCategory

    @ApiProperty({
        required: false
    })
    message?: string

    @ApiProperty({
        type: SnippetDto,
        required: false
    })
    snippet?: SnippetDto

}

export {
    HintDto
}
