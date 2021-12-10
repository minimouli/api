/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Post } from '@nestjs/common'
import AuthService from './auth.service'
import LoginReqDto from './dto/login.req.dto'
import LoginResDto from './dto/login.res.dto'
import Account from '../account/schemas/account.schema'

@Controller('/auth')
class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/login')
    async login(@Body() loginReqDto: LoginReqDto): Promise<LoginResDto> {

        return this.authService.login(loginReqDto).then((account: Account) => {

            return {
                status: 'success',
                data: {
                    uuid: account.uuid
                }
            }
        })
    }

}

export default AuthController
