/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import type { INestApplication } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
            .compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    it('/ (GET)', () => request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!'))
})
