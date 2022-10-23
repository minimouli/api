/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { MoulinetteDto } from './moulinette.dto'

class GetMoulinetteResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: MoulinetteDto
    })
    data: MoulinetteDto

}

export {
    GetMoulinetteResDto
}
