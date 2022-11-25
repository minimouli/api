/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { TokensController } from './tokens.controller'
import { TokensService } from './tokens.service'
import type { Account } from '../accounts/entities/account.entity'

describe('TokensController', () => {

    let tokensController: TokensController
    const tokensService = {
        listAuthTokensFromAccountId: jest.fn(),
        deleteAuthTokenById: jest.fn()
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

        tokensService.listAuthTokensFromAccountId.mockReset()
        tokensService.deleteAuthTokenById.mockReset()
    })

    describe('listCurrentUserAuthTokens', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const query = {
                limit: 20
            }
            const pagingResult = {
                data: ['item'],
                cursor: {
                    beforeCursor: 'before cursor',
                    afterCursor: 'after cursor'
                }
            }

            tokensService.listAuthTokensFromAccountId.mockResolvedValue(pagingResult)

            await expect(tokensController.listCurrentUserAuthTokens(currentUser, query)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    items: pagingResult.data,
                    ...pagingResult.cursor
                }
            })

            expect(tokensService.listAuthTokensFromAccountId).toHaveBeenCalledWith(currentUser.id, query, currentUser)
        })
    })

    describe('listAuthTokens', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const query = {
                limit: 20
            }
            const ownerId = 'owner id'
            const pagingResult = {
                data: ['item'],
                cursor: {
                    beforeCursor: 'before cursor',
                    afterCursor: 'after cursor'
                }
            }

            tokensService.listAuthTokensFromAccountId.mockResolvedValue(pagingResult)

            await expect(tokensController.listAuthTokens(currentUser, query, ownerId)).resolves.toStrictEqual({
                status: 'success',
                data: {
                    items: pagingResult.data,
                    ...pagingResult.cursor
                }
            })

            expect(tokensService.listAuthTokensFromAccountId).toHaveBeenCalledWith(ownerId, query, currentUser)
        })
    })

    describe('deleteAuthTokenById', () => {

        it('should return the correct response', async () => {

            const currentUser = { id: '1' } as Account
            const authTokenId = 'auth token id'

            await expect(tokensController.deleteAuthTokenById(currentUser, authTokenId)).resolves.toBeUndefined()

            expect(tokensService.deleteAuthTokenById).toHaveBeenCalledWith(authTokenId, currentUser)
        })
    })
})
