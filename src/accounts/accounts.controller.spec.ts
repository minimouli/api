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
import { Permission } from '../common/enums/permission.enum'
import type { Account } from './entities/account.entity'

describe('AccountsController', () => {

    let accountsController: AccountsController
    const accountsService = {
        delete: jest.fn(),
        deleteById: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        updateById: jest.fn(),
        updatePermissionsByAccountId: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [AccountsController]
        })
            .useMocker((token) => {
                if (token === AccountsService)
                    return accountsService

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        accountsController = moduleRef.get(AccountsController)

        accountsService.delete.mockReset()
        accountsService.deleteById.mockReset()
        accountsService.findById.mockReset()
        accountsService.update.mockReset()
        accountsService.updateById.mockReset()
        accountsService.updatePermissionsByAccountId.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
    })

    describe('getCurrentUserProfile', () => {

        const user = { id: '1' } as Account

        it('should return the correct response', () => expect(accountsController.getCurrentUserProfile(user))
            .toStrictEqual({
                status: 'success',
                data: user
            }))
    })

    describe('getUserProfile', () => {

        const accountId = 'account id'
        const foundUser = 'found user'

        it('should return the correct response', async () => {

            accountsService.findById.mockResolvedValue(foundUser)

            await expect(accountsController.getUserProfile(accountId)).resolves.toStrictEqual({
                status: 'success',
                data: foundUser
            })

            expect(accountsService.findById).toHaveBeenCalledWith(accountId)
        })
    })

    describe('updateCurrentUserProfile', () => {

        const currentUser = { id: '1' } as Account
        const body = { nickname: 'nickname' }
        const updatedAccount = 'updated account'

        it('should return the correct response', async () => {

            accountsService.update.mockResolvedValue(updatedAccount)

            await expect(accountsController.updateCurrentUserProfile(currentUser, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedAccount
            })

            expect(accountsService.update).toHaveBeenCalledWith(currentUser, body, currentUser)
        })
    })

    describe('updateUserProfile', () => {

        const currentUser = { id: '1' } as Account
        const accountId = 'account id'
        const body = { nickname: 'nickname' }
        const updatedAccount = 'updated account'

        it('should return the correct response', async () => {

            accountsService.updateById.mockResolvedValue(updatedAccount)

            await expect(accountsController.updateUserProfile(currentUser, accountId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedAccount
            })

            expect(accountsService.updateById).toHaveBeenCalledWith(accountId, body, currentUser)
        })
    })

    describe('updateUserPermissions', () => {

        const currentUser = { id: '1' } as Account
        const accountId = 'account id'
        const updatedAccount = 'updated account'
        const body = {
            permissions: [Permission.ReadAllAccounts]
        }

        it('should return the correct response', async () => {

            accountsService.updatePermissionsByAccountId.mockResolvedValue(updatedAccount)

            await expect(accountsController.updateUserPermissions(currentUser, accountId, body)).resolves.toStrictEqual({
                status: 'success',
                data: updatedAccount
            })

            expect(accountsService.updatePermissionsByAccountId).toHaveBeenCalledWith(accountId, body.permissions, currentUser)
        })
    })

    describe('deleteCurrentUserAccount', () => {

        const currentUser = { id: '1' } as Account

        it('should return the correct response', async () => {

            await expect(accountsController.deleteCurrentUserAccount(currentUser)).resolves.toBeUndefined()

            expect(accountsService.delete).toHaveBeenCalledWith(currentUser, currentUser)
        })
    })

    describe('deleteUserAccount', () => {

        const currentUser = { id: '1' } as Account
        const accountId = 'account id'

        it('should return the correct response', async () => {

            await expect(accountsController.deleteUserAccount(currentUser, accountId)).resolves.toBeUndefined()

            expect(accountsService.deleteById).toHaveBeenCalledWith(accountId, currentUser)
        })
    })
})
