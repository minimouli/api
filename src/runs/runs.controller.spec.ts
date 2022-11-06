/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { RunsController } from './runs.controller'
import { RunsService } from './runs.service'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import type { CreateRunReqDto } from './dto/create-run.req.dto'
import type { Account } from '../accounts/entities/account.entity'

describe('RunsController', () => {

    let runsController: RunsController
    const runsService = {
        create: jest.fn(),
        findById: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [RunsController]
        })
            .useMocker((token) => {
                if (token === RunsService)
                    return runsService

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        runsController = moduleRef.get(RunsController)

        runsService.create.mockReset()
        runsService.findById.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
    })

    describe('createRun', () => {

        const currentUser = { id: '1' } as Account
        const body = { moulinette: 'moulinette' } as CreateRunReqDto
        const createdRun = 'created run'

        it('should return the correct response', async () => {

            runsService.create.mockResolvedValue(createdRun)

            await expect(runsController.createRun(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: createdRun
            })

            expect(runsService.create).toHaveBeenCalledWith(body, currentUser)
        })
    })

    describe('getRun', () => {

        const runId = 'runId'
        const foundRun = 'found run'

        it('should return the correct response', async () => {

            runsService.findById.mockResolvedValue(foundRun)

            await expect(runsController.getRun(runId)).resolves.toStrictEqual({
                status: 'success',
                data: foundRun
            })

            expect(runsService.findById).toHaveBeenCalledWith(runId)
        })
    })
})
