/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { AccountsController } from './accounts.controller'
import type { Account } from './entities/account.entity'

describe('AccountsController', () => {

    let accountsController: AccountsController

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AccountsController]
        })
            .compile()

        accountsController = moduleRef.get(AccountsController)
    })

    describe('getCurrentUserProfile', () => {

        it('should return the correct response', () => {

            const user = {
                id: '1'
            } as Account

            expect(accountsController.getCurrentUserProfile(user)).toStrictEqual({
                status: 'success',
                data: user
            })
        })
    })
})
