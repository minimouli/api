/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import type { CreateProjectReqDto } from './dto/create-project.req.dto'
import type { Account } from '../accounts/entities/account.entity'

describe('ProjectsController', () => {

    let projectsController: ProjectsController
    const projectsService = {
        create: jest.fn(),
        deleteById: jest.fn(),
        findById: jest.fn(),
        list: jest.fn(),
        updateById: jest.fn()
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

        projectsService.create.mockReset()
        projectsService.deleteById.mockReset()
        projectsService.findById.mockReset()
        projectsService.list.mockReset()
        projectsService.updateById.mockReset()
    })

    describe('createProject', () => {

        const currentUser = { id: '1' } as Account
        const body = {
            name: 'name'
        } as CreateProjectReqDto
        const createdProject = 'created project'

        it('should return the correct response', async () => {

            projectsService.create.mockResolvedValue(createdProject)

            await expect(projectsController.createProject(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: createdProject
            })

            expect(projectsService.create).toHaveBeenCalledWith(body, currentUser)
        })
    })

    describe('getProject', () => {

        const projectId = 'project id'
        const foundProject = 'found project'

        it('should return the correct response', async () => {

            projectsService.findById.mockResolvedValue(foundProject)

            await expect(projectsController.getProject(projectId)).resolves.toStrictEqual({
                status: 'success',
                data: foundProject
            })

            expect(projectsService.findById).toHaveBeenCalledWith(projectId)
        })
    })

    describe('updateProjectInformation', () => {

        const currentUser = { id: '1' } as Account
        const projectId = '2'
        const body = { name: 'name' }
        const updatedProject = 'updated project'

        it('should return the correct response', async () => {

            projectsService.updateById.mockResolvedValue(updatedProject)

            await expect(projectsController.updateProjectInformation(currentUser, projectId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedProject
            })

            expect(projectsService.updateById).toHaveBeenCalledWith(projectId, body, currentUser)
        })
    })

    describe('deleteProjectById', () => {

        const currentUser = { id: '1' } as Account
        const projectId = '2'

        it('should return the correct response', async () => {

            await expect(projectsController.deleteProject(currentUser, projectId)).resolves.toBeUndefined()

            expect(projectsService.deleteById).toHaveBeenCalledWith(projectId, currentUser)
        })
    })

    describe('listProjects', () => {

        const query = {
            limit: 20
        }
        const pagingResult = {
            data: ['item'],
            cursor: {
                beforeCursor: 'before cursor',
                afterCursor: 'after cursor'
            }
        }

        it('should return the correct response', async () => {

            projectsService.list.mockResolvedValue(pagingResult)

            await expect(projectsController.listProjects(query)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    items: pagingResult.data,
                    ...pagingResult.cursor
                }
            })

            expect(projectsService.list).toHaveBeenCalledWith(query)
        })
    })
})
