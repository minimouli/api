/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import type { Account } from './entities/account.entity'

describe('AccountsController', () => {

    let accountsController: AccountsController
    const accountsService = {
        deleteAccount: jest.fn(),
        deleteAccountById: jest.fn(),
        findAccountById: jest.fn(),
        updateAccount: jest.fn(),
        updateAccountById: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AccountsController]
        })
            .useMocker((token) => {
                if (token === AccountsService)
                    return accountsService

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        accountsController = moduleRef.get(AccountsController)

        accountsService.deleteAccount.mockReset()
        accountsService.deleteAccountById.mockReset()
        accountsService.findAccountById.mockReset()
        accountsService.updateAccount.mockReset()
        accountsService.updateAccountById.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
    })

    describe('getCurrentUserProfile', () => {

        it('should return the correct response', () => {

            const user = { id: '1' } as Account

            expect(accountsController.getCurrentUserProfile(user)).toStrictEqual({
                status: 'success',
                data: user
            })
        })
    })

    describe('getUserProfile', () => {

        it('should return the correct response', async () => {

            const accountId = 'account id'
            const user = { id: '1' } as Account

            accountsService.findAccountById.mockResolvedValue(user)

            await expect(accountsController.getUserProfile(accountId)).resolves.toStrictEqual({
                status: 'success',
                data: user
            })

            expect(accountsService.findAccountById).toHaveBeenCalledWith(accountId)
        })
    })

    describe('updateCurrentUserProfile', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const body = { nickname: 'nickname' }
            const updatedAccount = { id: '2' } as Account

            accountsService.updateAccount.mockResolvedValue(updatedAccount)

            await expect(accountsController.updateCurrentUserProfile(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedAccount
            })

            expect(accountsService.updateAccount).toHaveBeenCalledWith(currentUser, body, currentUser)
        })
    })

    describe('updateUserProfile', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const accountId = 'account id'
            const body = { nickname: 'nickname' }
            const updatedAccount = { id: '2' } as Account

            accountsService.updateAccountById.mockResolvedValue(updatedAccount)

            await expect(accountsController.updateUserProfile(currentUser, accountId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedAccount
            })

            expect(accountsService.updateAccountById).toHaveBeenCalledWith(accountId, body, currentUser)
        })
    })

    describe('deleteCurrentUserAccount', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account

            await expect(accountsController.deleteCurrentUserAccount(currentUser)).resolves.toBeUndefined()

            expect(accountsService.deleteAccount).toHaveBeenCalledWith(currentUser, currentUser)
        })
    })

    describe('deleteUserAccount', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const accountId = 'account id'

            await expect(accountsController.deleteUserAccount(currentUser, accountId)).resolves.toBeUndefined()

            expect(accountsService.deleteAccountById).toHaveBeenCalledWith(accountId, currentUser)
        })
    })
})
