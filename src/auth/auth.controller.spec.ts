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
        signupWithGithub: jest.fn(),
        signupWithGithubAccessToken: jest.fn(),
        loginWithGithub: jest.fn(),
        loginWithGithubAccessToken: jest.fn()
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

        authService.signupWithGithub.mockReset()
        authService.signupWithGithubAccessToken.mockReset()
        authService.loginWithGithub.mockReset()
        authService.loginWithGithubAccessToken.mockReset()
        tokensService.create.mockReset()
    })

    describe('signupWithGithub', () => {

        const body = {
            code: 'github code',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.signupWithGithub.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.signupWithGithub(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.signupWithGithub).toHaveBeenCalledWith(body.code)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('signupWithGithubAccessToken', () => {

        const body = {
            accessToken: 'github access token',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.signupWithGithubAccessToken.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.signupWithGithubAccessToken(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.signupWithGithubAccessToken).toHaveBeenCalledWith(body.accessToken)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('loginWithGithub', () => {

        const body = {
            code: 'github code',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.loginWithGithub.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.loginWithGithub(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.loginWithGithub).toHaveBeenCalledWith(body.code)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('loginWithGithubAccessToken', () => {

        const body = {
            accessToken: 'github access token',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const accessToken = 'access token'

        it('should return the correct response', async () => {

            authService.loginWithGithubAccessToken.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, accessToken])

            await expect(authController.loginWithGithubAccessToken(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    accessToken
                }
            })

            expect(authService.loginWithGithubAccessToken).toHaveBeenCalledWith(body.accessToken)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })
})
