/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MoulinettesService } from './moulinettes.service'
import { Moulinette } from './entities/moulinette.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Project } from '../projects/entities/project.entity'

describe('MoulinettesService', () => {

    let moulinettesService: MoulinettesService
    const accountRepository = {
        findOneBy: jest.fn()
    }
    const moulinetteRepository = {
        create: jest.fn(),
        save: jest.fn()
    }
    const projectRepository = {
        findOneBy: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }
    const caslAbility = {
        can: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [MoulinettesService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Account))
                    return accountRepository

                if (token === getRepositoryToken(Moulinette))
                    return moulinetteRepository

                if (token === getRepositoryToken(Project))
                    return projectRepository

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        moulinettesService = moduleRef.get(MoulinettesService)

        accountRepository.findOneBy.mockReset()
        moulinetteRepository.create.mockReset()
        moulinetteRepository.save.mockReset()
        projectRepository.findOneBy.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
    })

    describe('createMoulinette', () => {

        const body = {
            project: 'project',
            repository: 'repository',
            maintainers: ['maintainer id 1', 'maintainer id 2'],
            isOfficial: true
        }
        const initiator = { id: '1' } as Account
        const foundProject = 'found project'
        const maintainer1 = 'maintainer 1'
        const maintainer2 = 'maintainer 2'
        const createdMoulinette = 'created moulinette'
        const savedMoulinette = 'saved moulinette'

        it('should throw a ForbiddenException if the initiator has not the permission to create moulinettes', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(moulinettesService.createMoulinette(body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Moulinette)
        })

        it('should throw a BadRequestException if the specified project id does not belong to an existing project', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            // eslint-disable-next-line unicorn/no-null
            projectRepository.findOneBy.mockResolvedValue(null)

            await expect(moulinettesService.createMoulinette(body, initiator)).rejects.toThrow(
                new BadRequestException('The specified project id does not belong to an existing project')
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Moulinette)
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: body.project })
        })

        it('should throw a BadRequestException if one of the specified maintainer ids does not belong to an existing account', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            projectRepository.findOneBy.mockResolvedValue(foundProject)
            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(moulinettesService.createMoulinette(body, initiator)).rejects.toThrow(
                new BadRequestException('A least one of the specified maintainer ids does not belong to an existing account')
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Moulinette)
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: body.project })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(1, { id: 'maintainer id 1' })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(2, { id: 'maintainer id 2' })
        })

        it('should return the saved moulinette', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            projectRepository.findOneBy.mockResolvedValue(foundProject)
            moulinetteRepository.create.mockReturnValue(createdMoulinette)
            moulinetteRepository.save.mockResolvedValue(savedMoulinette)
            accountRepository.findOneBy.mockResolvedValueOnce(maintainer1)
            accountRepository.findOneBy.mockResolvedValueOnce(maintainer2)

            await expect(moulinettesService.createMoulinette(body, initiator)).resolves.toBe(savedMoulinette)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Moulinette)
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: body.project })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(1, { id: 'maintainer id 1' })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(2, { id: 'maintainer id 2' })
            expect(moulinetteRepository.create).toHaveBeenCalledWith({
                project: foundProject,
                maintainers: [maintainer1, maintainer2],
                repository: body.repository,
                isOfficial: body.isOfficial
            })
            expect(moulinetteRepository.save).toHaveBeenCalledWith(createdMoulinette)
        })
    })
})
