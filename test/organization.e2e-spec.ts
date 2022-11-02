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
        createOrganization: () => 'create organization',
        findOrganizationById: () => 'find organization by id',
        updateOrganizationById: () => 'update organization by id',
        deleteOrganizationById: () => Promise.resolve()
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
                    data: organizationsService.createOrganization()
                }))
        })
    })

    describe('GET /organization/:organizationId', () => {

        it('should return 200', () => request(app.getHttpServer())
            .get('/organization/123')
            .expect(200)
            .expect({
                status: 'success',
                data: organizationsService.findOrganizationById()
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
                    data: organizationsService.updateOrganizationById()
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

            it('should return 200', () => request(app.getHttpServer())
                .delete('/organization/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })
})
