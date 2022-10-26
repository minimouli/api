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
import { MoulinettesService } from '../src/moulinettes/moulinettes.service'
import { MoulinetteSourcesService } from '../src/moulinettes/services/moulinette-sources.service'
import type { INestApplication } from '@nestjs/common'

/* eslint-disable max-nested-callbacks */

describe('Moulinettes', () => {

    let app: INestApplication
    let jwtService: JwtService
    const moulinettesService = {
        findMoulinetteById: () => 'findMoulinetteById',
        createMoulinette: () => 'createMoulinette',
        updateMoulinetteById: () => 'updateMoulinetteById',
        deleteMoulinetteById: () => Promise.resolve()
    }
    const moulinetteSourcesService = {
        postMoulinetteSource: () => 'postMoulinetteSource'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(MoulinettesService)
            .useValue(moulinettesService)
            .overrideProvider(MoulinetteSourcesService)
            .useValue(moulinetteSourcesService)
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

    describe('GET /moulinette/:moulinetteId', () => {

        it('should return 200', () => request(app.getHttpServer())
            .get('/moulinette/123')
            .expect(200)
            .expect({
                status: 'success',
                data: moulinettesService.findMoulinetteById()
            }))
    })

    describe('POST /moulinette', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .post('/moulinette')
            .send({
                project: 'project id',
                repository: 'repository',
                maintainers: ['maintainer id 1', 'maintainer id 2'],
                isOfficial: true
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
                .post('/moulinette')
                .set('Authorization', `Bearer ${jwt}`)
                .send({})
                .expect(400))

            it('should return 201', () => request(app.getHttpServer())
                .post('/moulinette')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    project: 'project-id',
                    repository: 'https://example.com',
                    maintainers: ['maintainer id 1', 'maintainer id 2'],
                    isOfficial: true
                })
                .expect(201)
                .expect({
                    status: 'success',
                    data: moulinettesService.createMoulinette()
                }))
        })
    })

    describe('PATCH /moulinette/:moulinetteId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .patch('/moulinette/123')
            .send({
                repository: 'https://example.com'
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
                .patch('/moulinette/123')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    repository: 'https://example.com'
                })
                .expect(200)
                .expect({
                    status: 'success',
                    data: moulinettesService.updateMoulinetteById()
                }))
        })
    })

    describe('DELETE /moulinette/:moulinetteId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .delete('/moulinette/123')
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
                .delete('/moulinette/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })

    describe('PUT /moulinette/:moulinetteId/:major.:minor.:patch', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .put('/moulinette/123/1.2.3')
            .send({
                tarball: 'https://example.com/tarball.tar.gz',
                rules: ['node >= 20'],
                isDeprecated: false
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
                .put('/moulinette/123/1.2.3')
                .set('Authorization', `Bearer ${jwt}`)
                .send({})
                .expect(400))

            it('should return 200', () => request(app.getHttpServer())
                .put('/moulinette/123/1.2.3')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    tarball: 'https://example.com/tarball.tar.gz',
                    rules: ['node >= 20'],
                    isDeprecated: false
                })
                .expect(200)
                .expect({
                    status: 'success',
                    data: moulinetteSourcesService.postMoulinetteSource()
                }))
        })
    })
})
