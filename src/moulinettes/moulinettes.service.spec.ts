/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MoulinettesService } from './moulinettes.service'
import { Moulinette } from './entities/moulinette.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Project } from '../projects/entities/project.entity'
import type { UpdateMoulinetteReqDto } from './dto/update-moulinette.req.dto'

describe('MoulinettesService', () => {

    let moulinettesService: MoulinettesService
    const accountRepository = {
        findOneBy: jest.fn()
    }
    const moulinetteRepository = {
        create: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
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
        moulinetteRepository.findOne.mockReset()
        moulinetteRepository.remove.mockReset()
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

    describe('updateMoulinette', () => {

        const subject = {
            id: '1',
            maintainers: [{ id: '2' }]
        } as Moulinette
        const initiator = { id: '3' } as Account
        const foundMoulinette = 'found moulinette'
        const maintainer1 = 'maintainer 1'
        const maintainer2 = 'maintainer 2'
        const body = {
            repository: 'repository',
            maintainers: ['maintainer id 1', 'maintainer id 2']
        }

        it('it should throw a ForbiddenException if the initiator has not the permission to update moulinettes', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(moulinettesService.updateMoulinette(subject, body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should throw a BadRequestException if one of the specified maintainer ids does not belong to an existing account', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(moulinettesService.updateMoulinette(subject, body, initiator)).rejects.toThrow(
                new BadRequestException('A least one of the specified maintainer ids does not belong to an existing account')
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(1, { id: 'maintainer id 1' })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(2, { id: 'maintainer id 2' })
        })

        it('should not update the maintainers if they are not specified in the body ', async () => {

            const bodyWithoutMaintainers = { repository: 'repository' }

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await moulinettesService.updateMoulinette(subject, bodyWithoutMaintainers, initiator)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(accountRepository.findOneBy).not.toHaveBeenCalled()
            expect(moulinetteRepository.save).toHaveBeenCalledWith({
                id: subject.id,
                repository: bodyWithoutMaintainers.repository,
                maintainers: subject.maintainers
            })
        })

        it('should throw a NotFoundException the the updated moulinette is not found', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            accountRepository.findOneBy.mockResolvedValueOnce(maintainer1)
            accountRepository.findOneBy.mockResolvedValueOnce(maintainer2)
            // eslint-disable-next-line unicorn/no-null
            moulinetteRepository.findOne.mockResolvedValue(null)

            await expect(moulinettesService.updateMoulinette(subject, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(1, { id: 'maintainer id 1' })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(2, { id: 'maintainer id 2' })
            expect(moulinetteRepository.save).toHaveBeenCalledWith({
                id: subject.id,
                repository: body.repository,
                maintainers: [maintainer1, maintainer2]
            })
            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: subject.id },
                relations: ['maintainers', 'project']
            })
        })

        it('should return the updated moulinette', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            accountRepository.findOneBy.mockResolvedValueOnce(maintainer1)
            accountRepository.findOneBy.mockResolvedValueOnce(maintainer2)
            moulinetteRepository.findOne.mockResolvedValue(foundMoulinette)

            await expect(moulinettesService.updateMoulinette(subject, body, initiator)).resolves.toBe(foundMoulinette)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(1, { id: 'maintainer id 1' })
            expect(accountRepository.findOneBy).toHaveBeenNthCalledWith(2, { id: 'maintainer id 2' })
            expect(moulinetteRepository.save).toHaveBeenCalledWith({
                id: subject.id,
                repository: body.repository,
                maintainers: [maintainer1, maintainer2]
            })
            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: subject.id },
                relations: ['maintainers', 'project']
            })
        })
    })

    describe('updateMoulinetteById', () => {

        let updateMoulinette: jest.SpyInstance

        const subjectId = 'subject id'
        const initiator = { id: '1' } as Account
        const foundMoulinette = 'found moulinette'
        const updatedMoulinette = 'updated moulinette'
        const body = { repository: 'repository' } as UpdateMoulinetteReqDto

        beforeEach(() => {
            updateMoulinette = jest.spyOn(moulinettesService, 'updateMoulinette')
        })

        it('should throw a NotFoundException if the moulinette is not found', async () => {

            // eslint-disable-next-line unicorn/no-null
            moulinetteRepository.findOne.mockResolvedValue(null)

            await expect(moulinettesService.updateMoulinetteById(subjectId, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: subjectId },
                relations: ['maintainers']
            })
        })

        it('should return the updated moulinette', async () => {

            moulinetteRepository.findOne.mockResolvedValue(foundMoulinette)
            updateMoulinette.mockResolvedValue(updatedMoulinette)

            await expect(moulinettesService.updateMoulinetteById(subjectId, body, initiator)).resolves.toBe(updatedMoulinette)

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: subjectId },
                relations: ['maintainers']
            })
            expect(updateMoulinette).toHaveBeenCalledWith(foundMoulinette, body, initiator)
        })
    })

    describe('deleteMoulinette', () => {

        const subject = { id: '1' } as Moulinette
        const initiator = { id: '2' } as Account

        it('should throw a ForbiddenException if the initiator has not the permission to delete moulinettes', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(moulinettesService.deleteMoulinette(subject, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
        })

        it('should delete the moulinettes', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(moulinettesService.deleteMoulinette(subject, initiator)).resolves.toBeUndefined()

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
            expect(moulinetteRepository.remove).toHaveBeenCalledWith(subject)
        })
    })

    describe('deleteMoulinetteById', () => {

        let deleteMoulinette: jest.SpyInstance

        const subjectId = 'subject id'
        const moulinette = { id: '1' } as Moulinette
        const initiator = { id: '2' } as Account

        beforeEach(() => {
            deleteMoulinette = jest.spyOn(moulinettesService, 'deleteMoulinette')
        })

        it('should throw a NotFoundException if subject id is not related to a project', async () => {

            // eslint-disable-next-line unicorn/no-null
            moulinetteRepository.findOne.mockResolvedValue(null)

            await expect(moulinettesService.deleteMoulinetteById(subjectId, initiator)).rejects.toThrow(new NotFoundException())

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: subjectId },
                relations: ['maintainers']
            })
        })

        it('should delete the project', async () => {

            moulinetteRepository.findOne.mockResolvedValue(moulinette)
            deleteMoulinette.mockReturnValue(Promise.resolve())

            await expect(moulinettesService.deleteMoulinetteById(subjectId, initiator)).resolves.toBeUndefined()

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: subjectId },
                relations: ['maintainers']
            })
            expect(deleteMoulinette).toHaveBeenCalledWith(moulinette, initiator)
        })
    })
})
