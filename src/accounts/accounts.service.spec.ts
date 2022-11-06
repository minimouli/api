/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AccountsService } from './accounts.service'
import { Account } from './entities/account.entity'
import { validateNickname, validateUsername } from './helpers/name.helper'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import type { CreateAccountReqDto } from './dto/create-account.req.dto'

jest.mock('./helpers/name.helper')

describe('AccountService', () => {

    let accountsService: AccountsService
    const accountRepository = {
        create: jest.fn(),
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
    const validateNicknameMock = validateNickname as jest.Mock
    const validateUsernameMock = validateUsername as jest.Mock

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AccountsService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Account))
                    return accountRepository

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        accountsService = moduleRef.get(AccountsService)

        accountRepository.create.mockReset()
        accountRepository.findOneBy.mockReset()
        accountRepository.remove.mockReset()
        accountRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
        validateNicknameMock.mockReset()
        validateUsernameMock.mockReset()
    })

    describe('create', () => {

        const body = {
            username: 'username'
        } as CreateAccountReqDto
        const createdAccount = 'created account'
        const savedAccount = 'saved account'

        it('should create a new account', async () => {

            accountRepository.create.mockReturnValue(createdAccount)
            accountRepository.save.mockReturnValue(savedAccount)

            await expect(accountsService.create(body)).resolves.toBe(savedAccount)

            expect(accountRepository.create).toHaveBeenCalledWith(body)
            expect(accountRepository.save).toHaveBeenCalledWith(createdAccount)
        })
    })

    describe('findById', () => {

        const id = 'id'
        const foundAccount = 'found account'

        it('should throw a NotFoundException if the id does not belong to an existing account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.findById(id)).rejects.toThrow(NotFoundException)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the found account', async () => {

            accountRepository.findOneBy.mockResolvedValue(foundAccount)

            await expect(accountsService.findById(id)).resolves.toStrictEqual(foundAccount)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })
    })

    describe('updateAccount', () => {

        let isTheUsernameAvailableSpy: jest.SpyInstance
        let findByIdSpy: jest.SpyInstance

        const subject = { id: '1' } as Account
        const body = {
            nickname: 'nickname',
            username: 'username'
        }
        const initiator = { id: '2' } as Account
        const foundAccount = 'found account'

        beforeEach(() => {
            isTheUsernameAvailableSpy = jest.spyOn(accountsService, 'isTheUsernameAvailable')
            findByIdSpy = jest.spyOn(accountsService, 'findById')
        })

        it('it should throw a ForbiddenException if the initiator has not the permission to update accounts', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(accountsService.update(subject, body, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should throw a BadRequestException if the nickname validation fails', async () => {

            const errors = ['error']

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue(errors)
            validateUsernameMock.mockReturnValue([])

            await expect(accountsService.update(subject, body, initiator)).rejects.toThrow(new BadRequestException(errors))

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateNicknameMock).toHaveBeenCalledWith(body.nickname)
        })

        it('should throw a BadRequestException if the username validation fails', async () => {

            const errors = ['error']

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue([])
            validateUsernameMock.mockReturnValue(errors)

            await expect(accountsService.update(subject, body, initiator)).rejects.toThrow(new BadRequestException(errors))

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
        })

        it('should throw a BadRequestException if the username is already taken', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue([])
            validateUsernameMock.mockReturnValue([])
            isTheUsernameAvailableSpy.mockResolvedValue(false)

            await expect(accountsService.update(subject, body, initiator)).rejects.toThrow(
                new BadRequestException('The username is already taken by another user')
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateNicknameMock).toHaveBeenCalledWith(body.nickname)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
            expect(isTheUsernameAvailableSpy).toHaveBeenCalledWith(body.username)
        })

        it('should return the updated account', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue([])
            validateUsernameMock.mockReturnValue([])
            isTheUsernameAvailableSpy.mockResolvedValue(true)
            findByIdSpy.mockResolvedValue(foundAccount)

            await expect(accountsService.update(subject, body, initiator)).resolves.toStrictEqual(foundAccount)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateNicknameMock).toHaveBeenCalledWith(body.nickname)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
            expect(isTheUsernameAvailableSpy).toHaveBeenCalledWith(body.username)
            expect(accountRepository.save).toHaveBeenCalledWith({
                ...subject,
                ...body
            })
            expect(findByIdSpy).toHaveBeenCalledWith(subject.id)
        })
    })

    describe('updateById', () => {

        let updateSpy: jest.SpyInstance

        const id = 'id'
        const body = {
            nickname: 'nickname'
        }
        const initiator = { id: '1' } as Account
        const foundAccount = 'found account'
        const updatedAccount = 'updated account'

        beforeEach(() => {
            updateSpy = jest.spyOn(accountsService, 'update')
        })

        it('should throw a NotFoundException if the id does not belong to an existing account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.updateById(id, body, initiator)).rejects.toThrow(NotFoundException)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the updated account', async () => {

            accountRepository.findOneBy.mockResolvedValue(foundAccount)
            updateSpy.mockResolvedValue(updatedAccount)

            await expect(accountsService.updateById(id, body, initiator)).resolves.toStrictEqual(updatedAccount)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
            expect(updateSpy).toHaveBeenCalledWith(foundAccount, body, initiator)
        })
    })

    describe('updatePermissions', () => {

        const subject = { id: '1' } as Account
        const permissions = [Permission.ReadAllAccounts]
        const initiator = {
            id: '1',
            permissions: [Permission.UpdateAccountPermissions]
        } as Account
        const updatedAccount = 'updated account'

        it('should throw a ForbiddenException if the initiator has not the permission to update account permissions', async () => {

            const initiatorWithoutPermissions = {
                id: '1',
                permissions: [] as Permission[]
            } as Account

            await expect(accountsService.updatePermissions(subject, permissions, initiatorWithoutPermissions)).rejects.toThrow(ForbiddenException)
        })

        it('should return the updated account', async () => {

            accountRepository.save.mockResolvedValue(updatedAccount)

            await expect(accountsService.updatePermissions(subject, permissions, initiator)).resolves.toBe(updatedAccount)

            expect(accountRepository.save).toHaveBeenCalledWith({
                ...subject,
                permissions
            })
        })
    })

    describe('updatePermissionsByAccountId', () => {

        let updatePermissionsSpy: jest.SpyInstance

        const id = 'id'
        const permissions = [Permission.ReadAllAccounts]
        const initiator = {
            id: '1'
        } as Account
        const foundAccount = 'found account'
        const updatedAccount = 'updated account'

        beforeEach(() => {
            updatePermissionsSpy = jest.spyOn(accountsService, 'updatePermissions')
        })

        it('should throw a NotFoundException if the id does not belong to an existing account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.updatePermissionsByAccountId(id, permissions, initiator)).rejects.toThrow(NotFoundException)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the updated account', async () => {

            accountRepository.findOneBy.mockResolvedValue(foundAccount)
            updatePermissionsSpy.mockResolvedValue(updatedAccount)

            await expect(accountsService.updatePermissionsByAccountId(id, permissions, initiator)).resolves.toBe(updatedAccount)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
            expect(updatePermissionsSpy).toHaveBeenCalledWith(foundAccount, permissions, initiator)
        })
    })

    describe('delete', () => {

        const subject = { id: '1' } as Account
        const initiator = { id: '2' } as Account

        it('should throw a ForbiddenException if the initiator has not the permission to delete accounts', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(accountsService.delete(subject, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
        })

        it('should delete the account', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(accountsService.delete(subject, initiator)).resolves.toBeUndefined()

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
            expect(accountRepository.remove).toHaveBeenCalledWith(subject)
        })
    })

    describe('deleteById', () => {

        let deleteSpy: jest.SpyInstance

        const id = 'id'
        const subject = { id: '1' } as Account
        const initiator = { id: '2' } as Account

        beforeEach(() => {
            deleteSpy = jest.spyOn(accountsService, 'delete')
        })

        it('should throw a NotFoundException if the id does not belong to an existing account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.deleteById(id, initiator)).rejects.toThrow(NotFoundException)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should delete the account by id', async () => {

            accountRepository.findOneBy.mockResolvedValue(subject)
            deleteSpy.mockReturnValue(Promise.resolve())

            await expect(accountsService.deleteById(id, initiator)).resolves.toBeUndefined()

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
            expect(deleteSpy).toHaveBeenCalledWith(subject, initiator)
        })
    })

    describe('isTheUsernameAvailable', () => {

        const username = 'username'

        it('should return true if the username is not associated with an account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.isTheUsernameAvailable(username)).resolves.toBeTruthy()

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ username })
        })

        it('should return false if the username is associated with an account', async () => {

            accountRepository.findOneBy.mockResolvedValue({ id: '1' } as Account)

            await expect(accountsService.isTheUsernameAvailable(username)).resolves.toBeFalsy()

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ username })
        })
    })
})
