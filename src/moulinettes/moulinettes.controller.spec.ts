/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { MoulinettesController } from './moulinettes.controller'
import { MoulinettesService } from './moulinettes.service'
import type { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'
import type { Account } from '../accounts/entities/account.entity'

describe('MoulinettesController', () => {

    let moulinettesController: MoulinettesController
    const moulinettesService = {
        createMoulinette: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [MoulinettesController]
        })
            .useMocker((token) => {
                if (token === MoulinettesService)
                    return moulinettesService
            })
            .compile()

        moulinettesController = moduleRef.get(MoulinettesController)

        moulinettesService.createMoulinette.mockReset()
    })

    describe('createMoulinette', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const body = { project: 'project' } as CreateMoulinetteReqDto
            const moulinette = 'moulinette'

            moulinettesService.createMoulinette.mockResolvedValue(moulinette)

            await expect(moulinettesController.createMoulinette(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: moulinette
            })

            expect(moulinettesService.createMoulinette).toHaveBeenCalledWith(body, currentUser)
        })
    })
})
