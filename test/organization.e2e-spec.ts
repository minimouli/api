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
import { OrganizationsService } from '../src/organizations/organizations.service'
import type { INestApplication } from '@nestjs/common'

describe('Organizations', () => {

    let app: INestApplication
    let jwtService: JwtService
    const organizationsService = {
        create: () => 'create',
        deleteById: () => Promise.resolve(),
        findById: () => 'find by id',
        list: () => ({
            object: 'list',
            data: ['item'],
            cursor: {
                beforeCursor: 'before cursor',
                afterCursor: 'after cursor'
            }
        }),
        updateById: () => 'update by id'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(OrganizationsService)
            .useValue(organizationsService)
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

    describe('POST /organization', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .post('/organization')
            .send({
                name: 'name',
                displayName: 'display name'
            })
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
                .post('/organization')
                .set('Authorization', `Bearer ${jwt}`)
                .send({})
                .expect(400))

            it('should return 201', () => request(app.getHttpServer())
                .post('/organization')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    name: 'name',
                    displayName: 'display name'
                })
                .expect(201)
                .expect({
                    status: 'success',
                    data: organizationsService.create()
                }))
        })
    })

    describe('GET /organization/:organizationId', () => {

        it('should return 200', () => request(app.getHttpServer())
            .get('/organization/123')
            .expect(200)
            .expect({
                status: 'success',
                data: organizationsService.findById()
            }))
    })

    describe('PATCH /organization/:organizationId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .patch('/organization/123')
            .send({
                name: 'name'
            })
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
                .patch('/organization/123')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    name: 'name'
                })
                .expect(200)
                .expect({
                    status: 'success',
                    data: organizationsService.updateById()
                }))
        })
    })

    describe('DELETE /organization/:organizationId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .delete('/organization/123')
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
                .delete('/organization/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })

    describe('GET /organizations', () => {

        it('should return 400 if the limit query parameter is less than 1', () => request(app.getHttpServer())
            .get('/organizations')
            .query({
                limit: 0
            })
            .expect(400))

        it('should return 400 if the limit query parameter is more than 100', () => request(app.getHttpServer())
            .get('/organizations')
            .query({
                limit: 101
            })
            .expect(400))

        it('should return 400 if the limit query parameter is not a number', () => request(app.getHttpServer())
            .get('/organizations')
            .query({
                limit: 'not a number'
            })
            .expect(400))

        it('should return 200', () => request(app.getHttpServer())
            .get('/organizations')
            .expect(200)
            .expect({
                status: 'success',
                data: {
                    object: 'list',
                    items: ['item'],
                    beforeCursor: 'before cursor',
                    afterCursor: 'after cursor'
                }
            }))
    })
})
