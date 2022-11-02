/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { OrganizationsService } from './organizations.service'
import { Organization } from './entities/organization.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { Account } from '../accounts/entities/account.entity'

describe('OrganizationsService', () => {

    let organizationsService: OrganizationsService
    const organizationRepository = {
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

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [OrganizationsService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Organization))
                    return organizationRepository

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        organizationsService = moduleRef.get(OrganizationsService)

        organizationRepository.create.mockReset()
        organizationRepository.findOneBy.mockReset()
        organizationRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
    })

    describe('createOrganization', () => {

        const body = {
            name: 'name',
            displayName: 'display name'
        }
        const initiator = { id: '1' } as Account
        const createdOrganization = 'created organization'
        const savedOrganization = 'saved organization'

        it('should throw a ForbiddenException if the initiator has not the permission to create organizations', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(organizationsService.createOrganization(body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Organization)
        })

        it('should create a new organization', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            organizationRepository.create.mockReturnValue(createdOrganization)
            organizationRepository.save.mockResolvedValue(savedOrganization)

            await expect(organizationsService.createOrganization(body, initiator)).resolves.toBe(savedOrganization)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Organization)
            expect(organizationRepository.create).toHaveBeenCalledWith(body)
            expect(organizationRepository.save).toHaveBeenCalledWith(createdOrganization)
        })
    })

    describe('updateOrganization', () => {

        const subject = { id: '1' } as Organization
        const body = { name: 'name' }
        const initiator = { id: '2' } as Account
        const savedOrganization = 'saved organization'

        it('it should throw a ForbiddenException if the initiator has not the permission to update organizations', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(organizationsService.updateOrganization(subject, body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should return the updated project', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            organizationRepository.save.mockResolvedValue(savedOrganization)

            await expect(organizationsService.updateOrganization(subject, body, initiator)).resolves.toBe(savedOrganization)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(organizationRepository.save).toHaveBeenCalledWith({
                ...subject,
                ...body
            })
        })
    })

    describe('updateOrganizationById', () => {

        let updateOrganization: jest.SpyInstance

        const subjectId = '1'
        const body = { name: 'name' }
        const initiator = { id: '2' } as Account
        const foundOrganization = { id: '3' } as Organization
        const updatedOrganization = 'updated organization'

        beforeEach(() => {
            updateOrganization = jest.spyOn(organizationsService, 'updateOrganization')
        })

        it('should throw a NotFoundException if the organization id is not related to an actual organization', async () => {

            // eslint-disable-next-line unicorn/no-null
            organizationRepository.findOneBy.mockResolvedValue(null)

            await expect(organizationsService.updateOrganizationById(subjectId, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
        })

        it('should return the updated project', async () => {

            organizationRepository.findOneBy.mockResolvedValue(foundOrganization)
            updateOrganization.mockResolvedValue(updatedOrganization)

            await expect(organizationsService.updateOrganizationById(subjectId, body, initiator)).resolves.toBe(updatedOrganization)

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
            expect(updateOrganization).toHaveBeenCalledWith(foundOrganization, body, initiator)
        })
    })
})
