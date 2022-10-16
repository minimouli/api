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
import { DefaultPermissions } from '../common/configs/permissions.config'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import { getRandomString } from '../common/helpers/random.helper'
import { LOWER_CASE_ALPHA, NUMERIC } from '../common/helpers/string.helper'

jest.mock('./helpers/name.helper')
jest.mock('../common/helpers/random.helper')

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
    const getRandomStringMock = getRandomString as jest.Mock

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
        getRandomStringMock.mockReset()
    })

    describe('create', () => {

        const nickname = 'nickname'
        const username = 'username'
        const email = 'email'
        const permissions = [Permission.UpdateOwnAccount]
        const createdAccount = { id: '1' } as Account
        const savedAccount = { id: '2' } as Account

        it('should return the created account with default permissions', async () => {

            accountRepository.create.mockReturnValue(createdAccount)
            accountRepository.save.mockResolvedValue(savedAccount)
            getRandomStringMock.mockReturnValue(username)

            await expect(accountsService.create(nickname, email)).resolves.toStrictEqual(savedAccount)

            expect(accountRepository.create).toHaveBeenCalledWith({
                username,
                nickname,
                email,
                permissions: DefaultPermissions
            })
            expect(accountRepository.save).toHaveBeenCalledWith(createdAccount)
            expect(getRandomStringMock).toHaveBeenCalledWith(16, `${LOWER_CASE_ALPHA}${NUMERIC}`)
        })

        it('should return the created account with specified permissions', async () => {

            accountRepository.create.mockReturnValue(createdAccount)
            accountRepository.save.mockResolvedValue(savedAccount)
            getRandomStringMock.mockReturnValue(username)

            await expect(accountsService.create(nickname, email, permissions)).resolves.toStrictEqual(savedAccount)

            expect(accountRepository.create).toHaveBeenCalledWith({
                username,
                nickname,
                email,
                permissions
            })
            expect(accountRepository.save).toHaveBeenCalledWith(createdAccount)
            expect(getRandomStringMock).toHaveBeenCalledWith(16, `${LOWER_CASE_ALPHA}${NUMERIC}`)
        })
    })

    describe('findAccountById', () => {

        const id = '1'
        const account = { id: '1' } as Account

        it('should throw a NotFoundException if the id is not related to an account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.findAccountById(id)).rejects.toThrow(new NotFoundException())

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })

        it('should return the account found', async () => {

            accountRepository.findOneBy.mockResolvedValue(account)

            await expect(accountsService.findAccountById(id)).resolves.toStrictEqual(account)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id })
        })
    })

    describe('updateAccount', () => {

        let isTheUsernameAvailable: jest.SpyInstance

        const subject = { id: '1' } as Account
        const initiator = { id: '2' } as Account
        const updatedAccount = { id: '3' } as Account
        const body = {
            nickname: 'nickname',
            username: 'username'
        }

        beforeEach(() => {
            isTheUsernameAvailable = jest.spyOn(accountsService, 'isTheUsernameAvailable')
        })

        it('it should throw a ForbiddenException if the initiator has not the permission to update accounts', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(accountsService.updateAccount(subject, body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should throw a BadRequestException if the nickname validation fails', async () => {

            const errors = ['error']

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue(errors)
            validateUsernameMock.mockReturnValue([])

            await expect(accountsService.updateAccount(subject, body, initiator)).rejects.toThrow(new BadRequestException(errors))

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

            await expect(accountsService.updateAccount(subject, body, initiator)).rejects.toThrow(new BadRequestException(errors))

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
        })

        it('should throw a BadRequestException if the username is already taken', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue([])
            validateUsernameMock.mockReturnValue([])
            isTheUsernameAvailable.mockResolvedValue(false)

            await expect(accountsService.updateAccount(subject, body, initiator)).rejects.toThrow(
                new BadRequestException('The username is already taken by another user')
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateNicknameMock).toHaveBeenCalledWith(body.nickname)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
            expect(isTheUsernameAvailable).toHaveBeenCalledWith(body.username)
        })

        it('should throw a NotFoundException the the updated is not found', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue([])
            validateUsernameMock.mockReturnValue([])
            isTheUsernameAvailable.mockResolvedValue(true)
            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.updateAccount(subject, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateNicknameMock).toHaveBeenCalledWith(body.nickname)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
            expect(isTheUsernameAvailable).toHaveBeenCalledWith(body.username)
            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })

        it('should return the updated account', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            validateNicknameMock.mockReturnValue([])
            validateUsernameMock.mockReturnValue([])
            isTheUsernameAvailable.mockResolvedValue(true)
            accountRepository.findOneBy.mockResolvedValue(updatedAccount)

            await expect(accountsService.updateAccount(subject, body, initiator)).resolves.toStrictEqual(updatedAccount)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(validateNicknameMock).toHaveBeenCalledWith(body.nickname)
            expect(validateUsernameMock).toHaveBeenCalledWith(body.username)
            expect(isTheUsernameAvailable).toHaveBeenCalledWith(body.username)
            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })
    })

    describe('updateAccountById', () => {

        let updateAccount: jest.SpyInstance

        const subjectId = 'subject id'
        const account = { id: '1' } as Account
        const initiator = { id: '2' } as Account
        const updatedAccount = { id: '3' } as Account
        const body = { nickname: 'nickname' }

        beforeEach(() => {
            updateAccount = jest.spyOn(accountsService, 'updateAccount')
        })

        it('should throw a NotFoundException if the account is not found', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.updateAccountById(subjectId, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
        })

        it('should return the updated account', async () => {

            accountRepository.findOneBy.mockResolvedValue(account)
            updateAccount.mockResolvedValue(updatedAccount)

            await expect(accountsService.updateAccountById(subjectId, body, initiator)).resolves.toStrictEqual(updatedAccount)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
            expect(updateAccount).toHaveBeenCalledWith(account, body, initiator)
        })
    })

    describe('deleteAccount', () => {

        const subject = { id: '1' } as Account
        const initiator = { id: '2' } as Account

        it('should throw a ForbiddenException if the initiator has not the permission to delete accounts', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(accountsService.deleteAccount(subject, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
        })

        it('should delete the account', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(accountsService.deleteAccount(subject, initiator)).resolves.toBeUndefined()

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
            expect(accountRepository.remove).toHaveBeenCalledWith(subject)
        })
    })

    describe('deleteAccountById', () => {

        let deleteAccount: jest.SpyInstance

        const subjectId = 'subject id'
        const subject = { id: '1' } as Account
        const initiator = { id: '2' } as Account

        beforeEach(() => {
            deleteAccount = jest.spyOn(accountsService, 'deleteAccount')
        })

        it('should throw a NotFoundException if subject id is not related to an account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(accountsService.deleteAccountById(subjectId, initiator)).rejects.toThrow(new NotFoundException())

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
        })

        it('should delete the account by subject id', async () => {

            accountRepository.findOneBy.mockResolvedValue(subject)
            deleteAccount.mockReturnValue(Promise.resolve())

            await expect(accountsService.deleteAccountById(subjectId, initiator)).resolves.toBeUndefined()

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: subjectId })
            expect(deleteAccount).toHaveBeenCalledWith(subject, initiator)
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
