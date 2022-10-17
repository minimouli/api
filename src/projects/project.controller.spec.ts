/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import type { Account } from '../accounts/entities/account.entity'

describe('ProjectsController', () => {

    let projectsController: ProjectsController
    const projectsService = {
        createProject: jest.fn(),
        deleteProjectById: jest.fn(),
        findProjectById: jest.fn(),
        updateProjectById: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [ProjectsController]
        })
            .useMocker((token) => {
                if (token === ProjectsService)
                    return projectsService
            })
            .compile()

        projectsController = moduleRef.get(ProjectsController)

        projectsService.createProject.mockReset()
        projectsService.deleteProjectById.mockReset()
        projectsService.findProjectById.mockReset()
        projectsService.updateProjectById.mockReset()
    })

    describe('getProject', () => {

        it('should return the correct response', async () => {

            const projectId = 'project id'
            const project = { id: '1' }

            projectsService.findProjectById.mockResolvedValue(project)

            await expect(projectsController.getProject(projectId)).resolves.toStrictEqual({
                status: 'success',
                data: project
            })

            expect(projectsService.findProjectById).toHaveBeenCalledWith(projectId)
        })
    })

    describe('createProject', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const body = {
                name: 'name',
                organization: 'organization'
            }
            const project = 'project'

            projectsService.createProject.mockResolvedValue(project)

            await expect(projectsController.createProject(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: project
            })

            expect(projectsService.createProject).toHaveBeenCalledWith(body.name, body.organization, currentUser)
        })
    })

    describe('updateProjectInformation', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const projectId = '2'
            const body = { name: 'name' }
            const project = 'project'

            projectsService.updateProjectById.mockResolvedValue(project)

            await expect(projectsController.updateProjectInformation(currentUser, projectId, body)).resolves.toStrictEqual({
                status: 'success',
                data: project
            })

            expect(projectsService.updateProjectById).toHaveBeenCalledWith(projectId, body, currentUser)
        })
    })

    describe('deleteProjectById', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const projectId = '2'

            await expect(projectsController.deleteProject(currentUser, projectId)).resolves.toBeUndefined()

            expect(projectsService.deleteProjectById).toHaveBeenCalledWith(projectId, currentUser)
        })
    })
})
