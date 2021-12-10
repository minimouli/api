/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiTags
} from '@nestjs/swagger'
import AuthService from './auth.service'
import LoginReqDto from './dto/login.req.dto'
import LoginResDto from './dto/login.res.dto'
import Account from '../account/schemas/account.schema'

@Controller('/auth')
@ApiTags('auth')
class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/login')
    @HttpCode(200)
    @ApiBadRequestResponse({ description: 'Bad parameters format or bad credentials.' })
    async login(@Body() loginReqDto: LoginReqDto): Promise<LoginResDto> {

        return this.authService.login(loginReqDto).then((account: Account) => ({
            status: 'success',
            data: {
                uuid: account.uuid,
                token: this.authService.generateToken(account)
            }
        }))
    }

}

export default AuthController
