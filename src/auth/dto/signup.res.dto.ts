/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { AccountDto } from '../../accounts/dto/account.dto'

class SignupDataResDto {

    @ApiProperty({
        type: AccountDto
    })
    account: AccountDto

    @ApiProperty()
    jwt: string

}

class SignupResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: SignupDataResDto
    })
    data: SignupDataResDto

}

export {
    SignupResDto
}
