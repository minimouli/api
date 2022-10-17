/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ProjectsService } from './projects.service'
import { getCurrentCycle } from './helpers/cycle.helper'
import { Project } from './entities/project.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { Account } from '../accounts/entities/account.entity'

jest.mock('./helpers/cycle.helper')

describe('ProjectsService', () => {

    let projectsService: ProjectsService
    const projectRepository = {
        create: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }
    const caslAbility = {
        can: jest.fn()
    }
    const getCurrentCycleMock = getCurrentCycle as jest.Mock

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [ProjectsService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Project))
                    return projectRepository

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        projectsService = moduleRef.get(ProjectsService)

        projectRepository.create.mockReset()
        projectRepository.findOneBy.mockReset()
        projectRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
    })

    describe('createProject', () => {

        const name = 'Name'
        const organization = 'Organization'
        const initiator = { id: '1' } as Account
        const foundProject = { id: '2' } as Project
        const createdProject = { id: '2' } as Project
        const savedProject = { id: '3' } as Project
        const cycle = 2022

        it('should throw a ForbiddenException if the initiator has not the permission to create projects', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(projectsService.createProject(name, organization, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Project)
        })

        it('should return an existing project if a project already exists', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            projectRepository.findOneBy.mockResolvedValue(foundProject)
            getCurrentCycleMock.mockReturnValue(cycle)

            await expect(projectsService.createProject(name, organization, initiator)).resolves.toStrictEqual(foundProject)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Project)
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({
                name: name.toLowerCase(),
                organization: organization.toLowerCase(),
                cycle
            })
        })

        it('should create a new project', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            // eslint-disable-next-line unicorn/no-null
            projectRepository.findOneBy.mockResolvedValue(null)
            projectRepository.create.mockReturnValue(createdProject)
            projectRepository.save.mockResolvedValue(savedProject)
            getCurrentCycleMock.mockReturnValue(cycle)

            await expect(projectsService.createProject(name, organization, initiator)).resolves.toStrictEqual(savedProject)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Project)
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({
                name: name.toLowerCase(),
                organization: organization.toLowerCase(),
                cycle
            })
            expect(projectRepository.create).toHaveBeenCalledWith({
                name,
                organization,
                cycle
            })
            expect(projectRepository.save).toHaveBeenCalledWith(createdProject)
        })
    })

    describe('findProjectById', () => {

        const id = '1'
        const project = { id: '1' } as Project

        it('should throw a NotFoundException if the id is not related to a project', async () => {

            // eslint-disable-next-line unicorn/no-null
            projectRepository.findOneBy.mockResolvedValue(null)

            await expect(projectsService.findProjectById(id)).rejects.toThrow(new NotFoundException())

            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the project found', async () => {

            projectRepository.findOneBy.mockResolvedValue(project)

            await expect(projectsService.findProjectById(id)).resolves.toStrictEqual(project)

            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id })
        })
    })

    describe('updateProject', () => {

        const subject = { id: '1' } as Project
        const initiator = { id: '2' } as Account
        const foundProject = { id: '3' } as Project
        const body = { name: 'name' }

        it('it should throw a ForbiddenException if the initiator has not the permission to update projects', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(projectsService.updateProject(subject, body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should throw a NotFoundException the the updated project is not found', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            // eslint-disable-next-line unicorn/no-null
            projectRepository.findOneBy.mockResolvedValue(null)

            await expect(projectsService.updateProject(subject, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(projectRepository.save).toHaveBeenCalledWith({
                ...subject,
                ...body
            })
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })

        it('should return the updated project', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            projectRepository.findOneBy.mockResolvedValue(foundProject)

            await expect(projectsService.updateProject(subject, body, initiator)).resolves.toStrictEqual(foundProject)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(projectRepository.save).toHaveBeenCalledWith({
                ...subject,
                ...body
            })
            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })
    })

    describe('updateProjectById', () => {

        let updateProject: jest.SpyInstance

        const subjectId = 'subject id'
        const initiator = { id: '1' } as Account
        const foundProject = { id: '2' } as Project
        const updatedProject = { id: '3' } as Project
        const body = { name: 'name' }

        beforeEach(() => {
            updateProject = jest.spyOn(projectsService, 'updateProject')
        })

        it('should throw a NotFoundException if the project is not found', async () => {

            // eslint-disable-next-line unicorn/no-null
            projectRepository.findOneBy.mockResolvedValue(null)

            await expect(projectsService.updateProjectById(subjectId, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
        })

        it('should return the updated project', async () => {

            projectRepository.findOneBy.mockResolvedValue(foundProject)
            updateProject.mockResolvedValue(updatedProject)

            await expect(projectsService.updateProjectById(subjectId, body, initiator)).resolves.toStrictEqual(updatedProject)

            expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
            expect(updateProject).toHaveBeenCalledWith(foundProject, body, initiator)
        })
    })
})
