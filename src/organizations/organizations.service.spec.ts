/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { OrganizationsService } from './organizations.service'
import { Organization } from './entities/organization.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { Account } from '../accounts/entities/account.entity'

jest.mock('typeorm-cursor-pagination')

describe('OrganizationsService', () => {

    let organizationsService: OrganizationsService
    const organizationRepository = {
        create: jest.fn(),
        createQueryBuilder: jest.fn(),
        findOneBy: jest.fn(),
        remove: jest.fn(),
        save: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }
    const caslAbility = {
        can: jest.fn()
    }
    const paginator = {
        paginate: jest.fn()
    }
    const buildPaginatorMock = buildPaginator as jest.Mock

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
        organizationRepository.createQueryBuilder.mockReset()
        organizationRepository.findOneBy.mockReset()
        organizationRepository.remove.mockReset()
        organizationRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
        paginator.paginate.mockReset()
        buildPaginatorMock.mockReset()
    })

    describe('create', () => {

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

            await expect(organizationsService.create(body, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Organization)
        })

        it('should create a new organization', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            organizationRepository.create.mockReturnValue(createdOrganization)
            organizationRepository.save.mockResolvedValue(savedOrganization)

            await expect(organizationsService.create(body, initiator)).resolves.toBe(savedOrganization)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, Organization)
            expect(organizationRepository.create).toHaveBeenCalledWith(body)
            expect(organizationRepository.save).toHaveBeenCalledWith(createdOrganization)
        })
    })

    describe('findById', () => {

        const id = 'id'
        const foundOrganization = 'found organization'

        it('should throw a NotFoundException if the id does not belong to an existing organization', async () => {

            // eslint-disable-next-line unicorn/no-null
            organizationRepository.findOneBy.mockResolvedValue(null)

            await expect(organizationsService.findById(id)).rejects.toThrow(NotFoundException)

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the found organization', async () => {

            organizationRepository.findOneBy.mockResolvedValue(foundOrganization)

            await expect(organizationsService.findById(id)).resolves.toStrictEqual(foundOrganization)

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id })
        })
    })

    describe('list', () => {

        const query = {
            limit: 20
        }
        const queryBuilder = 'query builder'
        const pagingResult = 'paging result'

        it('should return the pagination', async () => {

            organizationRepository.createQueryBuilder.mockReturnValue(queryBuilder)
            paginator.paginate.mockResolvedValue(pagingResult)
            buildPaginatorMock.mockReturnValue(paginator)

            await expect(organizationsService.list(query)).resolves.toBe(pagingResult)

            expect(organizationRepository.createQueryBuilder).toHaveBeenCalledWith('organization')
            expect(buildPaginatorMock).toHaveBeenCalledWith({
                entity: Organization,
                paginationKeys: ['id'],
                query: {
                    ...query,
                    order: 'ASC'
                }
            })
            expect(paginator.paginate).toHaveBeenCalledWith(queryBuilder)
        })
    })

    describe('update', () => {

        const subject = { id: '1' } as Organization
        const body = { name: 'name' }
        const initiator = { id: '2' } as Account
        const savedOrganization = 'saved organization'

        it('it should throw a ForbiddenException if the initiator has not the permission to update organizations', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(organizationsService.update(subject, body, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should return the updated project', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            organizationRepository.save.mockResolvedValue(savedOrganization)

            await expect(organizationsService.update(subject, body, initiator)).resolves.toBe(savedOrganization)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(organizationRepository.save).toHaveBeenCalledWith({
                ...subject,
                ...body
            })
        })
    })

    describe('updateById', () => {

        let updateSpy: jest.SpyInstance

        const id = '1'
        const body = { name: 'name' }
        const initiator = { id: '2' } as Account
        const foundOrganization = { id: '3' } as Organization
        const updatedOrganization = 'updated organization'

        beforeEach(() => {
            updateSpy = jest.spyOn(organizationsService, 'update')
        })

        it('should throw a NotFoundException if the id does not belong to an existing organization', async () => {

            // eslint-disable-next-line unicorn/no-null
            organizationRepository.findOneBy.mockResolvedValue(null)

            await expect(organizationsService.updateById(id, body, initiator)).rejects.toThrow(NotFoundException)

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the updated project', async () => {

            organizationRepository.findOneBy.mockResolvedValue(foundOrganization)
            updateSpy.mockResolvedValue(updatedOrganization)

            await expect(organizationsService.updateById(id, body, initiator)).resolves.toBe(updatedOrganization)

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id })
            expect(updateSpy).toHaveBeenCalledWith(foundOrganization, body, initiator)
        })
    })

    describe('delete', () => {

        const subject = { id: '1' } as Organization
        const initiator = { id: '2' } as Account

        it('should throw a ForbiddenException if the initiator has not the permission to delete organizations', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(organizationsService.delete(subject, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
        })

        it('should delete the organization', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(organizationsService.delete(subject, initiator)).resolves.toBeUndefined()

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
            expect(organizationRepository.remove).toHaveBeenCalledWith(subject)
        })
    })

    describe('deleteById', () => {

        let deleteSpy: jest.SpyInstance

        const id = 'id'
        const foundOrganization = 'found organization'
        const initiator = { id: '1' } as Account

        beforeEach(() => {
            deleteSpy = jest.spyOn(organizationsService, 'delete')
        })

        it('should throw a NotFoundException if id does not belong to an existing organization', async () => {

            // eslint-disable-next-line unicorn/no-null
            organizationRepository.findOneBy.mockResolvedValue(null)

            await expect(organizationsService.deleteById(id, initiator)).rejects.toThrow(NotFoundException)

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should delete the organization', async () => {

            organizationRepository.findOneBy.mockResolvedValue(foundOrganization)
            deleteSpy.mockReturnValue(Promise.resolve())

            await expect(organizationsService.deleteById(id, initiator)).resolves.toBeUndefined()

            expect(organizationRepository.findOneBy).toHaveBeenCalledWith({ id })
            expect(deleteSpy).toHaveBeenCalledWith(foundOrganization, initiator)
        })
    })
})
