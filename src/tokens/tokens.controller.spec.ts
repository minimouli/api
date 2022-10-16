/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { TokensController } from './tokens.controller'
import { TokensService } from './tokens.service'
import { Account } from '../accounts/entities/account.entity'

describe('TokensController', () => {

    let tokensController: TokensController
    const tokensService = {
        getAllAuthTokensFromAccountId: jest.fn(),
        deleteAuthToken: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [TokensController]
        })
            .useMocker((token) => {
                if (token === TokensService)
                    return tokensService
            })
            .compile()

        tokensController = moduleRef.get(TokensController)

        tokensService.getAllAuthTokensFromAccountId.mockReset()
        tokensService.deleteAuthToken.mockReset()
    })

    describe('getCurrentUserAuthTokens', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const authTokens = ['auth tokens']

            tokensService.getAllAuthTokensFromAccountId.mockResolvedValue(authTokens)

            await expect(tokensController.getCurrentUserAuthTokens(currentUser)).resolves.toStrictEqual({
                status: 'success',
                data: authTokens
            })

            expect(tokensService.getAllAuthTokensFromAccountId).toHaveBeenCalledWith(currentUser.id, currentUser)
        })
    })

    describe('getAuthTokens', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const ownerId = 'owner id'
            const authTokens = ['auth tokens']

            tokensService.getAllAuthTokensFromAccountId.mockResolvedValue(authTokens)

            await expect(tokensController.getAuthTokens(currentUser, ownerId)).resolves.toStrictEqual({
                status: 'success',
                data: authTokens
            })

            expect(tokensService.getAllAuthTokensFromAccountId).toHaveBeenCalledWith(ownerId, currentUser)
        })
    })

    describe('deleteAuthToken', () => {

        it('should return the correct response', async () => {

            const user = new Account()
            const authTokenId = '1'

            await expect(tokensController.deleteAuthToken(user, authTokenId)).resolves.toBeUndefined()

            expect(tokensService.deleteAuthToken).toHaveBeenCalledWith(authTokenId, user)
        })
    })
})
