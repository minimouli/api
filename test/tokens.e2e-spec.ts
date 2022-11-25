/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { TokensService } from '../src/tokens/tokens.service'
import type { INestApplication } from '@nestjs/common'

describe('Tokens', () => {

    let app: INestApplication
    let jwtService: JwtService
    const tokensService = {
        listAuthTokensFromAccountId: () => ({
            data: ['item'],
            cursor: {
                beforeCursor: 'before cursor',
                afterCursor: 'after cursor'
            }
        }),
        deleteAuthTokenById: () => Promise.resolve()
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(TokensService)
            .useValue(tokensService)
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

    describe('GET /me/tokens', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .get('/me/tokens')
            .expect(401))

        describe('logged', () => {

            const accountId = 'user-2'
            let jwt: string

            beforeEach(() => {
                jwt = jwtService.sign({
                    sub: accountId,
                    jti: `${accountId}-auth-token`
                })
            })

            it('should return 400 if the limit query parameter is less than 1', () => request(app.getHttpServer())
                .get('/me/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .query({
                    limit: 0
                })
                .expect(400))

            it('should return 400 if the limit query parameter is more than 100', () => request(app.getHttpServer())
                .get('/me/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .query({
                    limit: 101
                })
                .expect(400))

            it('should return 400 if the limit query parameter is not a number', () => request(app.getHttpServer())
                .get('/me/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .query({
                    limit: 'not a number'
                })
                .expect(400))

            it('should return 200', () => request(app.getHttpServer())
                .get('/me/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
                .expect({
                    status: 'success',
                    data: {
                        items: ['item'],
                        beforeCursor: 'before cursor',
                        afterCursor: 'after cursor'
                    }
                }))
        })
    })

    describe('GET /account/:ownerId/tokens', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .get('/account/123/tokens')
            .expect(401))

        describe('logged', () => {

            const accountId = 'user-2'
            let jwt: string

            beforeEach(() => {
                jwt = jwtService.sign({
                    sub: accountId,
                    jti: `${accountId}-auth-token`
                })
            })

            it('should return 400 if the limit query parameter is less than 1', () => request(app.getHttpServer())
                .get('/account/123/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .query({
                    limit: 0
                })
                .expect(400))

            it('should return 400 if the limit query parameter is more than 100', () => request(app.getHttpServer())
                .get('/account/123/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .query({
                    limit: 101
                })
                .expect(400))

            it('should return 400 if the limit query parameter is not a number', () => request(app.getHttpServer())
                .get('/account/123/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .query({
                    limit: 'not a number'
                })
                .expect(400))

            it('should return 200', () => request(app.getHttpServer())
                .get('/account/123/tokens')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
                .expect({
                    status: 'success',
                    data: {
                        items: ['item'],
                        beforeCursor: 'before cursor',
                        afterCursor: 'after cursor'
                    }
                }))
        })
    })

    describe('DELETE /token/:authTokenId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .delete('/token/123')
            .expect(401))

        describe('logged', () => {

            const accountId = 'user-2'
            let jwt: string

            beforeEach(() => {
                jwt = jwtService.sign({
                    sub: accountId,
                    jti: `${accountId}-auth-token`
                })
            })

            it('should return 204', () => request(app.getHttpServer())
                .delete('/token/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })
})
