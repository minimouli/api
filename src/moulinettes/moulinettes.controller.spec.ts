/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { MoulinettesController } from './moulinettes.controller'
import { MoulinettesService } from './moulinettes.service'
import { MoulinetteSourcesService } from './services/moulinette-sources.service'
import type { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'
import type { PostMoulinetteSourceReqDto } from './dto/post-moulinette-source.req.dto'
import type { Account } from '../accounts/entities/account.entity'

describe('MoulinettesController', () => {

    let moulinettesController: MoulinettesController
    const moulinettesService = {
        findMoulinetteById: jest.fn(),
        createMoulinette: jest.fn(),
        updateMoulinetteById: jest.fn(),
        deleteMoulinetteById: jest.fn()
    }
    const moulinetteSourcesService = {
        postMoulinetteSource: jest.fn(),
        deleteMoulinetteSourceByVersion: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [MoulinettesController]
        })
            .useMocker((token) => {
                if (token === MoulinettesService)
                    return moulinettesService

                if (token === MoulinetteSourcesService)
                    return moulinetteSourcesService
            })
            .compile()

        moulinettesController = moduleRef.get(MoulinettesController)

        moulinettesService.createMoulinette.mockReset()
        moulinettesService.updateMoulinetteById.mockReset()
        moulinetteSourcesService.postMoulinetteSource.mockReset()
        moulinetteSourcesService.deleteMoulinetteSourceByVersion.mockReset()
    })

    describe('getMoulinette', () => {

        it('should return the correct response', async () => {

            const id = '1'
            const moulinette = 'moulinette'

            moulinettesService.findMoulinetteById.mockResolvedValue(moulinette)

            await expect(moulinettesController.getMoulinette(id)).resolves.toStrictEqual({
                status: 'success',
                data: moulinette
            })

            expect(moulinettesService.findMoulinetteById).toHaveBeenCalledWith(id)
        })
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

    describe('updateMoulinetteInformation', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const moulinetteId = 'moulinette id'
            const body = { project: 'project' } as CreateMoulinetteReqDto
            const moulinette = 'moulinette'

            moulinettesService.updateMoulinetteById.mockResolvedValue(moulinette)

            await expect(moulinettesController.updateMoulinetteInformation(currentUser, moulinetteId, body)).resolves.toStrictEqual({
                status: 'success',
                data: moulinette
            })

            expect(moulinettesService.updateMoulinetteById).toHaveBeenCalledWith(moulinetteId, body, currentUser)
        })
    })

    describe('deleteMoulinette', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const moulinetteId = 'moulinette id'

            await expect(moulinettesController.deleteMoulinette(currentUser, moulinetteId)).resolves.toBeUndefined()

            expect(moulinettesService.deleteMoulinetteById).toHaveBeenCalledWith(moulinetteId, currentUser)
        })
    })

    describe('postMoulinetteSource', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const moulinetteId = 'moulinette id'
            const majorVersion = 1
            const minorVersion = 2
            const patchVersion = 3
            const body = {
                tarball: 'https://example.com/tarball.tar.gz'
            } as PostMoulinetteSourceReqDto
            const moulinetteSource = 'moulinette source'

            moulinetteSourcesService.postMoulinetteSource.mockResolvedValue(moulinetteSource)

            await expect(moulinettesController.postMoulinetteSource(
                currentUser, moulinetteId, majorVersion, minorVersion, patchVersion, body
            )).resolves.toStrictEqual({
                status: 'success',
                data: moulinetteSource
            })

            expect(moulinetteSourcesService.postMoulinetteSource).toHaveBeenCalledWith(
                moulinetteId, [majorVersion, minorVersion, patchVersion], body, currentUser
            )
        })
    })

    describe('deleteMoulinetteSource', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const moulinetteId = 'moulinette id'
            const majorVersion = 1
            const minorVersion = 2
            const patchVersion = 3

            await expect(moulinettesController.deleteMoulinetteSource(
                currentUser, moulinetteId, majorVersion, minorVersion, patchVersion
            )).resolves.toBeUndefined()

            expect(moulinetteSourcesService.deleteMoulinetteSourceByVersion).toHaveBeenCalledWith(
                moulinetteId, [majorVersion, minorVersion, patchVersion], currentUser
            )
        })

    })
})
