/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable max-nested-callbacks */

import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import type { INestApplication } from '@nestjs/common'

describe('Accounts', () => {

    let app: INestApplication
    let jwtService: JwtService

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

    describe('GET /me', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .get('/me')
            .expect(401))

        describe('logged', () => {

            const accountId = 'admin'
            let jwt: string

            beforeEach(() => {
                jwt = jwtService.sign({
                    sub: accountId,
                    jti: `${accountId}-auth-token`
                })
            })

            it('it should return 200', () => request(app.getHttpServer())
                .get('/me')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200))
        })
    })
})
