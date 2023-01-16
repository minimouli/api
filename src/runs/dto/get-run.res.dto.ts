/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { RunDto } from './run.dto'

class GetRunResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: RunDto
    })
    data: RunDto

}

export {
    GetRunResDto
}
