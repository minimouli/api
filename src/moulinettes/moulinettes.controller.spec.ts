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
import type { PutMoulinetteSourceReqDto } from './dto/put-moulinette-source.req.dto'
import type { Account } from '../accounts/entities/account.entity'

describe('MoulinettesController', () => {

    let moulinettesController: MoulinettesController
    const moulinettesService = {
        create: jest.fn(),
        deleteById: jest.fn(),
        findById: jest.fn(),
        updateById: jest.fn()
    }
    const moulinetteSourcesService = {
        deleteByVersion: jest.fn(),
        put: jest.fn()
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

        moulinettesService.create.mockReset()
        moulinettesService.deleteById.mockReset()
        moulinettesService.findById.mockReset()
        moulinettesService.updateById.mockReset()
        moulinetteSourcesService.deleteByVersion.mockReset()
        moulinetteSourcesService.put.mockReset()
    })

    describe('getMoulinette', () => {

        const id = '1'
        const foundMoulinette = 'found moulinette'

        it('should return the correct response', async () => {

            moulinettesService.findById.mockResolvedValue(foundMoulinette)

            await expect(moulinettesController.getMoulinette(id)).resolves.toStrictEqual({
                status: 'success',
                data: foundMoulinette
            })

            expect(moulinettesService.findById).toHaveBeenCalledWith(id)
        })
    })

    describe('createMoulinette', () => {

        const currentUser = { id: '1' } as Account
        const body = { project: 'project' } as CreateMoulinetteReqDto
        const createdMoulinette = 'created moulinette'

        it('should return the correct response', async () => {

            moulinettesService.create.mockResolvedValue(createdMoulinette)

            await expect(moulinettesController.createMoulinette(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: createdMoulinette
            })

            expect(moulinettesService.create).toHaveBeenCalledWith(body, currentUser)
        })
    })

    describe('updateMoulinetteInformation', () => {

        const currentUser = { id: '1' } as Account
        const moulinetteId = 'moulinette id'
        const body = { project: 'project' } as CreateMoulinetteReqDto
        const updatedMoulinette = 'updated moulinette'

        it('should return the correct response', async () => {

            moulinettesService.updateById.mockResolvedValue(updatedMoulinette)

            await expect(moulinettesController.updateMoulinetteInformation(currentUser, moulinetteId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedMoulinette
            })

            expect(moulinettesService.updateById).toHaveBeenCalledWith(moulinetteId, body, currentUser)
        })
    })

    describe('deleteMoulinette', () => {

        const currentUser = { id: '1' } as Account
        const moulinetteId = 'moulinette id'

        it('should return the correct response', async () => {

            await expect(moulinettesController.deleteMoulinette(currentUser, moulinetteId)).resolves.toBeUndefined()

            expect(moulinettesService.deleteById).toHaveBeenCalledWith(moulinetteId, currentUser)
        })
    })

    describe('putMoulinetteSource', () => {

        const currentUser = { id: '1' } as Account
        const moulinetteId = 'moulinette id'
        const majorVersion = 1
        const minorVersion = 2
        const patchVersion = 3
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PutMoulinetteSourceReqDto
        const putMoulinetteSource = 'put moulinette source'

        it('should return the correct response', async () => {

            moulinetteSourcesService.put.mockResolvedValue(putMoulinetteSource)

            await expect(moulinettesController.putMoulinetteSource(
                currentUser, moulinetteId, majorVersion, minorVersion, patchVersion, body
            )).resolves.toStrictEqual({
                status: 'success',
                data: putMoulinetteSource
            })

            expect(moulinetteSourcesService.put).toHaveBeenCalledWith(
                moulinetteId, [majorVersion, minorVersion, patchVersion], body, currentUser
            )
        })
    })

    describe('deleteMoulinetteSource', () => {

        const currentUser = { id: '1' } as Account
        const moulinetteId = 'moulinette id'
        const majorVersion = 1
        const minorVersion = 2
        const patchVersion = 3

        it('should return the correct response', async () => {

            await expect(moulinettesController.deleteMoulinetteSource(
                currentUser, moulinetteId, majorVersion, minorVersion, patchVersion
            )).resolves.toBeUndefined()

            expect(moulinetteSourcesService.deleteByVersion).toHaveBeenCalledWith(
                moulinetteId, [majorVersion, minorVersion, patchVersion], currentUser
            )
        })
    })
})
