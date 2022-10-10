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
        loginWithGithub: jest.fn()
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
        authService.loginWithGithub.mockReset()
        tokensService.create.mockReset()
    })

    describe('signupWithGithub', () => {

        const body = {
            code: 'github code',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const jwt = 'jwt'

        it('should return the correct response', async () => {

            authService.signupWithGithub.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, jwt])

            await expect(authController.signupWithGithub(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    jwt
                }
            })

            expect(authService.signupWithGithub).toHaveBeenCalledWith(body.code)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })

    describe('loginWithGithub', () => {

        const body = {
            code: 'github code',
            authTokenName: 'auth token name'
        }
        const account = 'account'
        const jwt = 'jwt'

        it('should return the correct response', async () => {

            authService.loginWithGithub.mockResolvedValue(account)
            tokensService.create.mockResolvedValue([undefined, jwt])

            await expect(authController.loginWithGithub(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account,
                    jwt
                }
            })

            expect(authService.loginWithGithub).toHaveBeenCalledWith(body.code)
            expect(tokensService.create).toHaveBeenCalledWith(body.authTokenName, account)
        })
    })
})
