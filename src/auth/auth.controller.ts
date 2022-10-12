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
import { ErrorResDto } from '../common/dto/error.res.dto'
import { TokensService } from '../tokens/tokens.service'

@Controller('/auth')
@ApiTags('auth')
class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly tokensService: TokensService
    ) {}

    @Post('/signup/github')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Sign up with a Github account' })
    @ApiOkResponse({
        type: SignupResDto,
        description: 'Successful signed up'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Unable to sign up with Github'
    })
    async signupWithGithub(@Body() body: SignupWithGithubReqDto): Promise<SignupResDto> {

        const { code, authTokenName } = body

        const account = await this.authService.signupWithGithub(code)
        const [, jwt] = await this.tokensService.create(authTokenName, account)

        return {
            status: 'success',
            data: {
                account,
                jwt
            }
        }
    }

    @Post('/login/github')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Login with a Github account' })
    @ApiOkResponse({
        type: LoginResDto,
        description: 'Successful logged'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Unable to login with Github'
    })
    async loginWithGithub(@Body() body: LoginWithGithubReqDto): Promise<LoginResDto> {

        const { code, authTokenName } = body

        const account = await this.authService.loginWithGithub(code)
        const [, jwt] = await this.tokensService.create(authTokenName, account)

        return {
            status: 'success',
            data: {
                account,
                jwt
            }
        }
    }

}

export {
    AuthController
}
