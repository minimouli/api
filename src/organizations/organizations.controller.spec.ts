/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'
import type { Account } from '../accounts/entities/account.entity'

describe('OrganizationsController', () => {

    let organizationsController: OrganizationsController
    const organizationsService = {
        create: jest.fn(),
        deleteById: jest.fn(),
        findById: jest.fn(),
        list: jest.fn(),
        updateById: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [OrganizationsController]
        })
            .useMocker((token) => {
                if (token === OrganizationsService)
                    return organizationsService
            })
            .compile()

        organizationsController = moduleRef.get(OrganizationsController)

        organizationsService.create.mockReset()
        organizationsService.deleteById.mockReset()
        organizationsService.findById.mockReset()
        organizationsService.list.mockReset()
        organizationsService.updateById.mockReset()
    })

    describe('createOrganization', () => {

        const currentUser = { id: '1' } as Account
        const body = {
            name: 'name',
            displayName: 'display name'
        }
        const createdOrganization = 'created organization'

        it('should return the correct response', async () => {

            organizationsService.create.mockResolvedValue(createdOrganization)

            await expect(organizationsController.createOrganization(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: createdOrganization
            })

            expect(organizationsService.create).toHaveBeenCalledWith(body, currentUser)
        })
    })

    describe('getOrganizationById', () => {

        const organizationId = 'organization id'
        const foundOrganization = 'found organization'

        it('should return the correct response', async () => {

            organizationsService.findById.mockResolvedValue(foundOrganization)

            await expect(organizationsController.getOrganizationById(organizationId)).resolves.toStrictEqual({
                status: 'success',
                data: foundOrganization
            })

            expect(organizationsService.findById).toHaveBeenCalledWith(organizationId)
        })
    })

    describe('updateOrganization', () => {

        const currentUser = { id: '2' } as Account
        const organizationId = '1'
        const body = {
            name: 'name',
            displayName: 'display name'
        }
        const updatedOrganization = 'updated organization'

        it('should return the correct response', async () => {

            organizationsService.updateById.mockResolvedValue(updatedOrganization)

            await expect(organizationsController.updateOrganization(currentUser, organizationId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedOrganization
            })

            expect(organizationsService.updateById).toHaveBeenCalledWith(organizationId, body, currentUser)
        })
    })

    describe('deleteOrganization', () => {

        const currentUser = { id: '2' } as Account
        const organizationId = '1'

        it('should return the correct response', async () => {

            await expect(organizationsController.deleteOrganization(currentUser, organizationId)).resolves.toBeUndefined()

            expect(organizationsService.deleteById).toHaveBeenCalledWith(organizationId, currentUser)
        })
    })

    describe('listOrganizations', () => {

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

            organizationsService.list.mockResolvedValue(pagingResult)

            await expect(organizationsController.listOrganizations(query)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    object: 'list',
                    items: pagingResult.data,
                    beforeCursor: pagingResult.cursor.beforeCursor,
                    afterCursor: pagingResult.cursor.afterCursor
                }
            })

            expect(organizationsService.list).toHaveBeenCalledWith(query)
        })
    })
})
