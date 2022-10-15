/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { Account } from './entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'

describe('AccountsController', () => {

    let accountsController: AccountsController
    const accountsService = {
        findAccountById: jest.fn()
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

        accountsService.findAccountById.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
    })

    describe('getCurrentUserProfile', () => {

        it('should return the correct response', () => {

            const user = new Account()

            expect(accountsController.getCurrentUserProfile(user)).toStrictEqual({
                status: 'success',
                data: user
            })
        })
    })

    describe('getUserProfile', () => {

        it('should return the correct response', async () => {

            const accountId = '1'
            const user = new Account()

            accountsService.findAccountById.mockResolvedValue(user)

            await expect(accountsController.getUserProfile(accountId)).resolves.toStrictEqual({
                status: 'success',
                data: user
            })

            expect(accountsService.findAccountById).toHaveBeenCalledWith(accountId)
        })
    })
})
