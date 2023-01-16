/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { AuthService } from '../src/auth/auth.service'
import { TokensService } from '../src/tokens/tokens.service'
import type { INestApplication } from '@nestjs/common'

describe('Auth', () => {

    let app: INestApplication
    const authService = {
        signupWithGitHubAuthCode: () => 'signup with github',
        signupWithGitHubAccessToken: () => 'signup with github access token',
        loginWithGitHubAuthCode: () => 'login with github',
        loginWithGitHubAccessToken: () => 'login with github access token'
    }
    const tokensService = {
        create: () => [undefined, 'access token']
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(AuthService)
            .useValue(authService)
            .overrideProvider(TokensService)
            .useValue(tokensService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    afterAll(() => app.close())

    describe('POST /auth/signup/github/auth-code', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/signup/github/auth-code')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/signup/github/auth-code')
            .send({
                code: 'github-code',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.signupWithGitHubAuthCode(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })

    describe('POST /auth/signup/github/access-token', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/signup/github/access-token')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/signup/github/access-token')
            .send({
                accessToken: 'github-access-token',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.signupWithGitHubAccessToken(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })

    describe('POST /auth/login/github/auth-code', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/login/github/auth-code')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/login/github/auth-code')
            .send({
                code: 'github-code',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.loginWithGitHubAuthCode(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })

    describe('POST /auth/login/github/access-token', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/login/github/access-token')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/login/github/access-token')
            .send({
                accessToken: 'github-access-token',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.loginWithGitHubAccessToken(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })
})
