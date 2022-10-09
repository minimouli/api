/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {

    let authController: AuthController
    const authService = {
        signupWithGithub: jest.fn(),
        loginWithGithub: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AuthController]
        })
            .useMocker((token) => {
                if (token === AuthService)
                    return authService
            })
            .compile()

        authController = moduleRef.get(AuthController)

        authService.signupWithGithub.mockReset()
        authService.loginWithGithub.mockReset()
    })

    describe('signupWithGithub', () => {

        const body = {
            code: 'github code'
        }
        const account = 'account'

        it('should return the correct response', async () => {

            authService.signupWithGithub.mockResolvedValue(account)

            await expect(authController.signupWithGithub(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account
                }
            })

            expect(authService.signupWithGithub).toHaveBeenCalledWith(body.code)
        })
    })

    describe('loginWithGithub', () => {

        const body = {
            code: 'github code'
        }
        const account = 'account'

        it('should return the correct response', async () => {

            authService.loginWithGithub.mockResolvedValue(account)

            await expect(authController.loginWithGithub(body)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    account
                }
            })

            expect(authService.loginWithGithub).toHaveBeenCalledWith(body.code)
        })
    })
})
