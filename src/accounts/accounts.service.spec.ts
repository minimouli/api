/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AccountsService } from './accounts.service'
import { Account } from './entities/account.entity'

describe('AccountService', () => {

    let accountsService: AccountsService
    const accountRepository = {
        findOneBy: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AccountsService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Account))
                    return accountRepository
            })
            .compile()

        accountsService = moduleRef.get(AccountsService)

        accountRepository.findOneBy.mockReset()
    })

    describe('findAccountById', () => {

        const id = '1'
        const account = new Account()

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
})
