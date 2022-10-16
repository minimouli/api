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
import { AccountsService } from '../src/accounts/accounts.service'
import type { INestApplication } from '@nestjs/common'

describe('Accounts', () => {

    let app: INestApplication
    let jwtService: JwtService
    const accountsService = {
        deleteAccount: () => Promise.resolve(),
        deleteAccountById: () => Promise.resolve(),
        findAccountById: () => 'findAccountById',
        updateAccount: () => 'updateAccount',
        updateAccountById: () => 'updateAccountById',
        updateAccountPermissionsById: () => 'updateAccountPermissionsById'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(AccountsService)
            .useValue(accountsService)
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

            it('should return 200', () => request(app.getHttpServer())
                .get('/me')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200))
        })
    })

    describe('GET /account/:accountId', () => {

        it('should return 200', () => request(app.getHttpServer())
            .get('/account/123')
            .expect(200))

        describe('logged', () => {

            const accountId = 'admin'
            let jwt: string

            beforeEach(() => {
                jwt = jwtService.sign({
                    sub: accountId,
                    jti: `${accountId}-auth-token`
                })
            })

            it('should return 200', () => request(app.getHttpServer())
                .get('/account/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
                .expect({
                    status: 'success',
                    data: accountsService.findAccountById()
                }))
        })
    })

    describe('PATCH /me', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .patch('/me')
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

            it('should return 200', () => request(app.getHttpServer())
                .patch('/me')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
                .expect({
                    status: 'success',
                    data: accountsService.updateAccount()
                }))
        })
    })

    describe('PATCH /account/:accountId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .patch('/account/123')
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

            it('should return 200', () => request(app.getHttpServer())
                .patch('/account/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
                .expect({
                    status: 'success',
                    data: accountsService.updateAccountById()
                }))
        })
    })

    describe('PUT /account/:accountId/permissions', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .put('/account/123/permissions')
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

            it('should return 400 if the body is incomplete', () => request(app.getHttpServer())
                .put('/account/123/permissions')
                .set('Authorization', `Bearer ${jwt}`)
                .send({})
                .expect(400))

            it('should return 200', () => request(app.getHttpServer())
                .put('/account/123/permissions')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    permissions: []
                })
                .expect(200)
                .expect({
                    status: 'success',
                    data: accountsService.updateAccountPermissionsById()
                }))
        })
    })

    describe('DELETE /me', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .delete('/me')
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

            it('should return 204', () => request(app.getHttpServer())
                .delete('/me')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })

    describe('DELETE /account/:accountId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .delete('/account/123')
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

            it('should return 204', () => request(app.getHttpServer())
                .delete('/account/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })
})
