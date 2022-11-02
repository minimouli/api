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
        createOrganization: jest.fn()
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
})
