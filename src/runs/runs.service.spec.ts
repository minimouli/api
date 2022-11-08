/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RunsService } from './runs.service'
import { Run } from './entities/run.entity'
import { Moulinette } from '../moulinettes/entities/moulinette.entity'
import { MoulinetteSource } from '../moulinettes/entities/moulinette-source.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { CreateRunReqDto } from './dto/create-run.req.dto'
import type { Account } from '../accounts/entities/account.entity'

describe('RunsService', () => {

    let runsService: RunsService
    const runRepository = {
        create: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        save: jest.fn()
    }
    const moulinetteRepository = {
        findOneBy: jest.fn(),
        save: jest.fn()
    }
    const moulinetteSourceRepository = {
        findOne: jest.fn(),
        save: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }
    const caslAbility = {
        can: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [RunsService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Run))
                    return runRepository

                if (token === getRepositoryToken(Moulinette))
                    return moulinetteRepository

                if (token === getRepositoryToken(MoulinetteSource))
                    return moulinetteSourceRepository

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        runsService = moduleRef.get(RunsService)

        runRepository.create.mockReset()
        runRepository.findOne.mockReset()
        runRepository.remove.mockReset()
        runRepository.save.mockReset()
        moulinetteRepository.findOneBy.mockReset()
        moulinetteRepository.save.mockReset()
        moulinetteSourceRepository.findOne.mockReset()
        moulinetteSourceRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
    })

    describe('create', () => {

        const moulinetteId = 'moulinette'
        const moulinetteVersion = [1, 2, 3]
        const [majorVersion, minorVersion, patchVersion] = moulinetteVersion
        const body = {
            moulinette: `${moulinetteId}@${moulinetteVersion.join('.')}`,
            suites: []
        } as CreateRunReqDto
        const initiator = { id: '1' } as Account
        const foundMoulinette = {
            id: '2',
            use: 1
        }
        const foundMoulinetteSource = {
            id: '3',
            use: 1
        }
        const savedMoulinette = 'saved moulinette'
        const createdRun = 'created run'
        const savedRun = 'saved run'

        it('should throw a ForbiddenException if the initiator has not the permission to create runs', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(runsService.create(body, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Run)
        })

        it('should throw a BadRequestException if the specified moulinette id does not belong to an existing moulinette', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            // eslint-disable-next-line unicorn/no-null
            moulinetteRepository.findOneBy.mockResolvedValue(null)

            await expect(runsService.create(body, initiator)).rejects.toThrow(
                new BadRequestException('The specified moulinette id does not belong to an existing moulinette')
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Run)
            expect(moulinetteRepository.findOneBy).toHaveBeenCalledWith({
                id: moulinetteId
            })
        })

        it('should create a new run without updating a moulinette source', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            moulinetteRepository.findOneBy.mockResolvedValue(foundMoulinette)
            // eslint-disable-next-line unicorn/no-null
            moulinetteSourceRepository.findOne.mockResolvedValue(null)
            moulinetteRepository.save.mockResolvedValue(savedMoulinette)
            runRepository.create.mockReturnValue(createdRun)
            runRepository.save.mockResolvedValue(savedRun)

            await expect(runsService.create(body, initiator)).resolves.toBe(savedRun)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Run)
            expect(moulinetteRepository.findOneBy).toHaveBeenCalledWith({
                id: moulinetteId
            })
            expect(moulinetteSourceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    majorVersion,
                    minorVersion,
                    patchVersion,
                    moulinette: {
                        id: moulinetteId
                    }
                },
                relations: ['moulinette']
            })
            expect(moulinetteRepository.save).toHaveBeenCalledWith({
                ...foundMoulinette,
                use: foundMoulinette.use + 1
            })
            expect(moulinetteSourceRepository.save).not.toHaveBeenCalled()
            expect(runRepository.create).toHaveBeenCalledWith({
                suites: body.suites,
                moulinette: savedMoulinette,
                moulinetteVersion: `${moulinetteVersion.join('.')}`,
                owner: initiator
            })
            expect(runRepository.save).toHaveBeenCalledWith(createdRun)
        })

        it('should create a new run with updating a moulinette source', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            moulinetteRepository.findOneBy.mockResolvedValue(foundMoulinette)
            moulinetteSourceRepository.findOne.mockResolvedValue(foundMoulinetteSource)
            moulinetteRepository.save.mockResolvedValue(savedMoulinette)
            runRepository.create.mockReturnValue(createdRun)
            runRepository.save.mockResolvedValue(savedRun)

            await expect(runsService.create(body, initiator)).resolves.toBe(savedRun)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Run)
            expect(moulinetteRepository.findOneBy).toHaveBeenCalledWith({
                id: moulinetteId
            })
            expect(moulinetteSourceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    majorVersion,
                    minorVersion,
                    patchVersion,
                    moulinette: {
                        id: moulinetteId
                    }
                },
                relations: ['moulinette']
            })
            expect(moulinetteRepository.save).toHaveBeenCalledWith({
                ...foundMoulinette,
                use: foundMoulinette.use + 1
            })
            expect(moulinetteSourceRepository.save).toHaveBeenCalledWith({
                ...foundMoulinetteSource,
                use: foundMoulinetteSource.use + 1
            })
            expect(runRepository.create).toHaveBeenCalledWith({
                suites: body.suites,
                moulinette: savedMoulinette,
                moulinetteVersion: `${moulinetteVersion.join('.')}`,
                owner: initiator
            })
            expect(runRepository.save).toHaveBeenCalledWith(createdRun)
        })
    })

    describe('findById', () => {

        const id = 'id'
        const foundRun = 'found run'

        it('should throw a NotFoundException if the id does not belong to an existing run', async () => {

            // eslint-disable-next-line unicorn/no-null
            runRepository.findOne.mockResolvedValue(null)

            await expect(runsService.findById(id)).rejects.toThrow(NotFoundException)

            expect(runRepository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: [
                    'moulinette',
                    'moulinette.project',
                    'moulinette.project.organization',
                    'owner'
                ]
            })
        })

        it('should return the found run', async () => {

            runRepository.findOne.mockResolvedValue(foundRun)

            await expect(runsService.findById(id)).resolves.toBe(foundRun)

            expect(runRepository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: [
                    'moulinette',
                    'moulinette.project',
                    'moulinette.project.organization',
                    'owner'
                ]
            })
        })
    })

    describe('delete', () => {

        const subject = { id: '1' } as Run
        const initiator = { id: '2' } as Account

        it('should throw a ForbiddenException if the initiator has not the permission to delete runs', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(runsService.delete(subject, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
        })

        it('should delete the run', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(runsService.delete(subject, initiator)).resolves.toBeUndefined()

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
            expect(runRepository.remove).toHaveBeenCalledWith(subject)
        })
    })

    describe('deleteById', () => {

        let deleteSpy: jest.SpyInstance

        const id = 'id'
        const initiator = { id: '1' } as Account
        const foundRun = { id: '2' } as Run

        beforeEach(() => {
            deleteSpy = jest.spyOn(runsService, 'delete')
        })

        it('should throw a NotFoundException if id does not belong to an existing run', async () => {

            // eslint-disable-next-line unicorn/no-null
            runRepository.findOne.mockResolvedValue(null)

            await expect(runsService.deleteById(id, initiator)).rejects.toThrow(NotFoundException)

            expect(runRepository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: ['owner']
            })
        })

        it('should delete the project', async () => {

            runRepository.findOne.mockResolvedValue(foundRun)
            deleteSpy.mockResolvedValue(Promise.resolve())

            await expect(runsService.deleteById(id, initiator)).resolves.toBeUndefined()

            expect(runRepository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: ['owner']
            })
            expect(deleteSpy).toHaveBeenCalledWith(foundRun, initiator)
        })
    })
})
