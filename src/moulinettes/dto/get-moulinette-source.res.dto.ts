/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { MoulinetteSourceDto } from './moulinette-source.dto'

class GetMoulinetteSourceResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: MoulinetteSourceDto
    })
    data: MoulinetteSourceDto

}

export {
    GetMoulinetteSourceResDto
}
