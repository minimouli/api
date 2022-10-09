/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, HttpCode, Post, SerializeOptions } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginResDto } from './dto/login.res.dto'
import { LoginWithGithubReqDto } from './dto/login-with-github.req.dto'
import { SignupResDto } from './dto/signup.res.dto'
import { SignupWithGithubReqDto } from './dto/signup-with-github.req.dto'

@Controller('/auth')
@ApiTags('auth')
class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/signup/github')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOkResponse({ type: SignupResDto })
    @ApiOperation({ summary: 'Sign up with a Github account' })
    @ApiOkResponse({ description: 'Successful sign up' })
    @ApiBadRequestResponse({ description: 'Unable to sign up with Github' })
    async signupWithGithub(@Body() body: SignupWithGithubReqDto): Promise<SignupResDto> {

        const { code } = body
        const account = await this.authService.signupWithGithub(code)

        return {
            status: 'success',
            data: {
                account
            }
        }
    }

    @Post('/login/github')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOkResponse({ type: LoginResDto })
    @ApiOperation({ summary: 'Login with a Github account' })
    @ApiOkResponse({ description: 'Successful login' })
    @ApiBadRequestResponse({ description: 'Unable to login with Github' })
    async loginWithGithub(@Body() body: LoginWithGithubReqDto): Promise<LoginResDto> {

        const { code } = body
        const account = await this.authService.loginWithGithub(code)

        return {
            status: 'success',
            data: {
                account
            }
        }
    }

}

export {
    AuthController
}
