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
        createOrganization: jest.fn(),
        findOrganizationById: jest.fn(),
        updateOrganizationById: jest.fn(),
        deleteOrganizationById: jest.fn()
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

        organizationsService.createOrganization.mockReset()
    })

    describe('createOrganization', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const body = {
                name: 'name',
                displayName: 'display name'
            }
            const createdOrganization = 'created organization'

            organizationsService.createOrganization.mockResolvedValue(createdOrganization)

            await expect(organizationsController.createOrganization(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: createdOrganization
            })

            expect(organizationsService.createOrganization).toHaveBeenCalledWith(body, currentUser)
        })
    })

    describe('getOrganizationById', () => {

        it('should return the correct response', async () => {

            const organizationId = 'organization id'
            const foundOrganization = 'found organization'

            organizationsService.findOrganizationById.mockResolvedValue(foundOrganization)

            await expect(organizationsController.getOrganizationById(organizationId)).resolves.toStrictEqual({
                status: 'success',
                data: foundOrganization
            })

            expect(organizationsService.findOrganizationById).toHaveBeenCalledWith(organizationId)
        })

    })

    describe('updateOrganization', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '2' } as Account
            const organizationId = '1'
            const body = {
                name: 'name',
                displayName: 'display name'
            }
            const updatedOrganization = 'updated organization'

            organizationsService.updateOrganizationById.mockResolvedValue(updatedOrganization)

            await expect(organizationsController.updateOrganization(currentUser, organizationId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedOrganization
            })

            expect(organizationsService.updateOrganizationById).toHaveBeenCalledWith(organizationId, body, currentUser)
        })

    })

    describe('deleteOrganization', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '2' } as Account
            const organizationId = '1'

            await expect(organizationsController.deleteOrganization(currentUser, organizationId)).resolves.toBeUndefined()

            expect(organizationsService.deleteOrganizationById).toHaveBeenCalledWith(organizationId, currentUser)
        })

    })
})
