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
import { RunsService } from '../src/runs/runs.service'
import type { INestApplication } from '@nestjs/common'

describe('Runs', () => {

    let app: INestApplication
    let jwtService: JwtService
    const runsService = {
        create: () => 'create',
        findById: () => 'find by id'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(RunsService)
            .useValue(runsService)
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

    describe('GET /run/:runId', () => {

        it('should return 200', () => request(app.getHttpServer())
            .get('/run/123')
            .expect(200)
            .expect({
                status: 'success',
                data: runsService.findById()
            }))

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
                .get('/run/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
                .expect({
                    status: 'success',
                    data: runsService.findById()
                }))
        })
    })

    describe('POST /run', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .post('/run')
            .send({
                moulinette: 'moulinetteid@1.2.3',
                suites: []
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
                .post('/run')
                .set('Authorization', `Bearer ${jwt}`)
                .send({})
                .expect(400))

            it('should return 400 if the moulinette id is invalid', () => request(app.getHttpServer())
                .post('/run')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    moulinette: 'moulinette-id',
                    suites: []
                })
                .expect(400))

            it('should return 201', () => request(app.getHttpServer())
                .post('/run')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    moulinette: 'moulinetteid@1.2.3',
                    suites: [{
                        name: 'Suite name',
                        suites: [],
                        tests: [{
                            name: 'Test name',
                            status: 'Status.Success',
                            duration: 200
                        }]
                    }]
                })
                .expect(201)
                .expect({
                    status: 'success',
                    data: runsService.create()
                }))
        })
    })
})
