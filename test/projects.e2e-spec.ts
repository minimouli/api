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
import { ProjectsService } from '../src/projects/projects.service'
import type { INestApplication } from '@nestjs/common'

describe('Projects', () => {

    let app: INestApplication
    let jwtService: JwtService
    const projectsService = {
        createProject: () => 'createProject',
        deleteProjectById: () => Promise.resolve(),
        findProjectById: () => 'findProjectById',
        updateProjectById: () => 'updateProjectById'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(ProjectsService)
            .useValue(projectsService)
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

    describe('GET /project/:projectId', () => {

        it('should return 200', () => request(app.getHttpServer())
            .get('/project/123')
            .expect(200)
            .expect({
                status: 'success',
                data: projectsService.findProjectById()
            }))
    })

    describe('POST /project', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .post('/project')
            .send({
                name: 'name',
                organization: 'organization'
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
                .post('/project')
                .set('Authorization', `Bearer ${jwt}`)
                .send({})
                .expect(400))

            it('should return 201', () => request(app.getHttpServer())
                .post('/project')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    name: 'name',
                    organization: 'organization'
                })
                .expect(201)
                .expect({
                    status: 'success',
                    data: projectsService.createProject()
                }))
        })
    })

    describe('PATCH /project/:projectId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .patch('/project/123')
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
                .patch('/project/123')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    name: 'name'
                })
                .expect(200)
                .expect({
                    status: 'success',
                    data: projectsService.updateProjectById()
                }))
        })
    })

    describe('DELETE /project/:projectId', () => {

        it('should return 401 if the user is not logged', () => request(app.getHttpServer())
            .delete('/project/123')
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
                .delete('/project/123')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(204))
        })
    })
})
