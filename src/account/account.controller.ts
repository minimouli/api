/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import AccountResDto from './dto/account.res.dto'
import JwtGuard from '../auth/guards/jwt-auth.guard'

@Controller('/account')
class AccountController {

    @UseGuards(JwtGuard)
    @Get('/me')
    me(@Request() req): AccountResDto {
        return {
            status: 'success',
            data: {
                uuid: req.user.accountUuid
            }
        }
    }

}

export default AccountController
