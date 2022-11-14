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
        signupWithGithub: () => 'signup with github',
        signupWithGithubAccessToken: () => 'signup with github access token',
        loginWithGithub: () => 'login with github',
        loginWithGithubAccessToken: () => 'login with github access token'
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

    describe('POST /auth/signup/github', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/signup/github')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/signup/github')
            .send({
                code: 'github-code',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.signupWithGithub(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })

    describe('POST /auth/signup/github/accessToken', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/signup/github/accessToken')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/signup/github/accessToken')
            .send({
                accessToken: 'github-access-token',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.signupWithGithubAccessToken(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })

    describe('POST /auth/login/github', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/login/github')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/login/github')
            .send({
                code: 'github-code',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.loginWithGithub(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })

    describe('POST /auth/login/github/accessToken', () => {

        it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
            .post('/auth/login/github/accessToken')
            .send({})
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .post('/auth/login/github/accessToken')
            .send({
                accessToken: 'github-access-token',
                authTokenName: 'auth-token-name'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.loginWithGithubAccessToken(),
                    accessToken: tokensService.create().at(1)
                }
            }))
    })
})
