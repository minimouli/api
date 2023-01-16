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
import { LoginWithGitHubReqDto } from './dto/login-with-github.req.dto'
import { LoginWithGitHubAccessTokenReqDto } from './dto/login-with-github-access-token.req.dto'
import { SignupResDto } from './dto/signup.res.dto'
import { SignupWithGitHubReqDto } from './dto/signup-with-github.req.dto'
import { SignupWithGitHubAccessTokenReqDto } from './dto/signup-with-github-access-token.req.dto'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { TokensService } from '../tokens/tokens.service'

@Controller('/auth')
@ApiTags('auth')
class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly tokensService: TokensService
    ) {}

    @Post('/signup/github/auth-code')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Sign up with a GitHub authorization code' })
    @ApiOkResponse({
        type: SignupResDto,
        description: 'Successful signed up'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Unable to sign up with GitHub'
    })
    async signupWithGitHubAuthCode(@Body() body: SignupWithGitHubReqDto): Promise<SignupResDto> {

        const { code, authTokenName } = body

        const account = await this.authService.signupWithGitHubAuthCode(code)
        const [, accessToken] = await this.tokensService.create(authTokenName, account)

        return {
            status: 'success',
            data: {
                account,
                accessToken
            }
        }
    }

    @Post('/signup/github/access-token')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Sign up with a GitHub access token' })
    @ApiOkResponse({
        type: SignupResDto,
        description: 'Successful signed up'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Unable to sign up with GitHub'
    })
    async signupWithGitHubAccessToken(@Body() body: SignupWithGitHubAccessTokenReqDto): Promise<SignupResDto> {

        const { accessToken: githubAccessToken, authTokenName } = body

        const account = await this.authService.signupWithGitHubAccessToken(githubAccessToken)
        const [, accessToken] = await this.tokensService.create(authTokenName, account)

        return {
            status: 'success',
            data: {
                account,
                accessToken
            }
        }
    }

    @Post('/login/github/auth-code')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Login with a GitHub authorization code' })
    @ApiOkResponse({
        type: LoginResDto,
        description: 'Successful logged'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Unable to login with GitHub'
    })
    async loginWithGitHubAuthCode(@Body() body: LoginWithGitHubReqDto): Promise<LoginResDto> {

        const { code, authTokenName } = body

        const account = await this.authService.loginWithGitHubAuthCode(code)
        const [, accessToken] = await this.tokensService.create(authTokenName, account)

        return {
            status: 'success',
            data: {
                account,
                accessToken
            }
        }
    }

    @Post('/login/github/access-token')
    @HttpCode(200)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Login with a GitHub access token' })
    @ApiOkResponse({
        type: LoginResDto,
        description: 'Successful logged'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Unable to login with GitHub'
    })
    async loginWithGitHubAccessToken(@Body() body: LoginWithGitHubAccessTokenReqDto): Promise<LoginResDto> {

        const { accessToken: githubAccessToken, authTokenName } = body

        const account = await this.authService.loginWithGitHubAccessToken(githubAccessToken)
        const [, accessToken] = await this.tokensService.create(authTokenName, account)

        return {
            status: 'success',
            data: {
                account,
                accessToken
            }
        }
    }

}

export {
    AuthController
}
