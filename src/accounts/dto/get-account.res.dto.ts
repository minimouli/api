/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { AccountDto } from './account.dto'

class GetAccountResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: AccountDto
    })
    data: AccountDto

}

export {
    GetAccountResDto
}
