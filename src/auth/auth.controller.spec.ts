/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TokensService } from '../tokens/tokens.service'

describe('AuthController', () => {

    let authController: AuthController
    const authService = {
        signupWithGitHubAuthCode: jest.fn(),
        signupWithGitHubAccessToken: jest.fn(),
        loginWithGitHubAuthCode: jest.fn(),
        loginWithGitHubAccessToken: jest.fn()
    }
    const tokensService = {
        create: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AuthController]
        })
            .useMocker((token) => {
                if (token === AuthService)
                    return authService

                if (token === TokensService)
                    return tokensService
            })
            .compile()

        authController = moduleRef.get(AuthController)

        authService.signupWithGitHubAuthCode.mockReset()
        authService.signupWithGitHubAccessToken.mockReset()
        authService.loginWithGitHubAuthCode.mockReset()
        authService.loginWithGitHubAccessToken.mockReset()
        tokensService.create.mockReset()
    })

    describe('signupWithGitHubAuthCode', () => {

        const body = {
            code: 'github code',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.signupWithGitHubAuthCode.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.signupWithGitHubAuthCode(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.signupWithGitHubAuthCode).toHaveBeenCalledWith(body.code)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('signupWithGitHubAccessToken', () => {

        const body = {
            accessToken: 'github access token',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.signupWithGitHubAccessToken.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.signupWithGitHubAccessToken(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.signupWithGitHubAccessToken).toHaveBeenCalledWith(body.accessToken)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('loginWithGitHubAuthCode', () => {

        const body = {
            code: 'github code',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.loginWithGitHubAuthCode.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.loginWithGitHubAuthCode(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.loginWithGitHubAuthCode).toHaveBeenCalledWith(body.code)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('loginWithGitHubAccessToken', () => {

        const body = {
            accessToken: 'github access token',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.loginWithGitHubAccessToken.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.loginWithGitHubAccessToken(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.loginWithGitHubAccessToken).toHaveBeenCalledWith(body.accessToken)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })
})
