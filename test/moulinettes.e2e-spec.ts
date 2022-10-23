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
import type { INestApplication } from '@nestjs/common'

/* eslint-disable max-nested-callbacks */

describe('Moulinettes', () => {

    let app: INestApplication
    let jwtService: JwtService
    const moulinettesService = {
        createMoulinette: () => 'createMoulinette'
    }

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(MoulinettesService)
            .useValue(moulinettesService)
            .compile()

        app = moduleRef.createNestApplication()
        jwtService = app.get(JwtService)

        await app.init()
    })

    afterAll(() => app.close())

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
})
