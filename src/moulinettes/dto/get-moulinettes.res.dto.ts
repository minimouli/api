/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { MoulinetteDto } from './moulinette.dto'

class GetMoulinettesDataResDto {

    @ApiProperty()
    object: string

    @ApiProperty({
        type: [MoulinetteDto]
    })
    items: MoulinetteDto[]

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

class GetMoulinettesResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: GetMoulinettesDataResDto
    })
    data: GetMoulinettesDataResDto

}

export {
    GetMoulinettesResDto
}
