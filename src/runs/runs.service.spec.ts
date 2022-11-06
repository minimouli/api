/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException } from '@nestjs/common'
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
        save: jest.fn()
    }
    const moulinetteRepository = {
        findOneBy: jest.fn()
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
        runRepository.save.mockReset()
        moulinetteRepository.findOneBy.mockReset()
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
        const foundMoulinette = 'found moulinette'
        const foundMoulinetteSource = {
            id: '2',
            use: 1
        }
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
            expect(moulinetteSourceRepository.save).not.toHaveBeenCalled()
            expect(runRepository.create).toHaveBeenCalledWith({
                suites: body.suites,
                moulinette: foundMoulinette,
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
            expect(moulinetteSourceRepository.save).toHaveBeenCalledWith({
                ...foundMoulinetteSource,
                use: foundMoulinetteSource.use + 1
            })
            expect(runRepository.create).toHaveBeenCalledWith({
                suites: body.suites,
                moulinette: foundMoulinette,
                moulinetteVersion: `${moulinetteVersion.join('.')}`,
                owner: initiator
            })
            expect(runRepository.save).toHaveBeenCalledWith(createdRun)
        })
    })
})
