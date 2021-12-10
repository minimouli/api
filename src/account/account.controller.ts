/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import AccountResDto from './dto/account.res.dto'
import JwtGuard from '../auth/guards/jwt-auth.guard'

@Controller('/account')
@ApiTags('account')
@ApiBearerAuth()
class AccountController {

    @Get('/me')
    @UseGuards(JwtGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
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
