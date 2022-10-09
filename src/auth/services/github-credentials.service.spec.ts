/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { GithubCredentialsService } from './github-credentials.service'
import { GithubCredentials } from '../entities/github-credentials.entity'
import { Account } from '../../accounts/entities/account.entity'

describe('GithubCredentialsService', () => {

    let githubCredentialsService: GithubCredentialsService
    const githubCredentialsRepository = {
        create: jest.fn(),
        save: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                GithubCredentialsService,
                {
                    provide: getRepositoryToken(GithubCredentials),
                    useValue: githubCredentialsRepository
                }
            ]
        })
            .compile()

        githubCredentialsService = moduleRef.get(GithubCredentialsService)

        githubCredentialsRepository.create.mockReset()
        githubCredentialsRepository.save.mockReset()
    })

    describe('create', () => {

        it('should return a github credentials', async () => {

            const githubId = 1
            const account = new Account()

            const createReturnValue = 'create return value'
            const saveReturnValue = 'save return value'

            githubCredentialsRepository.create.mockReturnValue(createReturnValue)
            githubCredentialsRepository.save.mockResolvedValue(saveReturnValue)

            await expect(githubCredentialsService.create(githubId, account)).resolves.toBe(saveReturnValue)

            expect(githubCredentialsRepository.create).toHaveBeenCalledWith({ githubId, account })
            expect(githubCredentialsRepository.save).toHaveBeenCalledWith(createReturnValue)
        })
    })
})
