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
import type { INestApplication } from '@nestjs/common'

describe('Auth', () => {

    let app: INestApplication
    const authService = {
        signupWithGithub: () => 'signup account',
        loginWithGithub: () => 'login account'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(AuthService)
            .useValue(authService)
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
                code: 'github-code'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.signupWithGithub()
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
                code: 'github-code'
            })
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    account: authService.loginWithGithub()
                }
            }))
    })

})
