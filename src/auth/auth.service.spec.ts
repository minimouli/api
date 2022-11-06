/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { GithubCredentials } from './entities/github-credentials.entity'
import { GithubApiService } from './services/github-api.service'
import { GithubCredentialsService } from './services/github-credentials.service'
import { AccountsService } from '../accounts/accounts.service'
import { DefaultPermissions } from '../common/configs/permissions.config'
import { getRandomString } from '../common/helpers/random.helper'
import { LOWER_CASE_ALPHA, NUMERIC } from '../common/helpers/string.helper'

jest.mock('../common/helpers/random.helper')

describe('AuthService', () => {

    let authService: AuthService
    const githubCredentialsRepository = {
        findOne: jest.fn()
    }
    const githubApiService = {
        consumeCodeForAccessToken: jest.fn(),
        getUserProfile: jest.fn(),
        getUserPrimaryEmail: jest.fn()
    }
    const githubCredentialsService = {
        create: jest.fn()
    }
    const accountsService = {
        create: jest.fn()
    }
    const getRandomStringMock = getRandomString as jest.Mock

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [AuthService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(GithubCredentials))
                    return githubCredentialsRepository

                if (token === GithubApiService)
                    return githubApiService

                if (token === GithubCredentialsService)
                    return githubCredentialsService

                if (token === AccountsService)
                    return accountsService
            })
            .compile()

        authService = moduleRef.get(AuthService)

        githubCredentialsRepository.findOne.mockReset()
        githubApiService.consumeCodeForAccessToken.mockReset()
        githubApiService.getUserProfile.mockReset()
        githubApiService.getUserPrimaryEmail.mockReset()
        githubCredentialsService.create.mockReset()
        accountsService.create.mockReset()
        getRandomStringMock.mockReset()
    })

    describe('signupWithGithub', () => {

        const code = 'code'
        const accessToken = 'access token'
        const userProfile = {
            id: 1,
            name: 'user name',
            avatar_url: 'avatar url'
        }
        const primaryEmail = 'primary email'

        it('should return an existing account if a github credentials exists', async () => {

            const credentials = {
                account: 'account'
            }

            githubApiService.consumeCodeForAccessToken.mockResolvedValue(accessToken)
            githubApiService.getUserProfile.mockResolvedValue(userProfile)
            githubCredentialsRepository.findOne.mockResolvedValue(credentials)

            await expect(authService.signupWithGithub(code)).resolves.toBe(credentials.account)

            expect(githubApiService.consumeCodeForAccessToken).toHaveBeenCalledWith(code)
            expect(githubApiService.getUserProfile).toHaveBeenCalledWith(accessToken)
            expect(githubCredentialsRepository.findOne).toHaveBeenCalledWith({
                where: { githubId: userProfile.id },
                relations: ['account']
            })
        })

        it('should create the newly created account', async () => {

            const account = 'account'
            const username = 'username'

            githubApiService.consumeCodeForAccessToken.mockResolvedValue(accessToken)
            githubApiService.getUserProfile.mockResolvedValue(userProfile)
            // eslint-disable-next-line unicorn/no-null
            githubCredentialsRepository.findOne.mockResolvedValue(null)
            githubApiService.getUserPrimaryEmail.mockResolvedValue(primaryEmail)
            accountsService.create.mockResolvedValue(account)
            getRandomStringMock.mockReturnValue(username)

            await expect(authService.signupWithGithub(code)).resolves.toBe(account)

            expect(githubApiService.consumeCodeForAccessToken).toHaveBeenCalledWith(code)
            expect(githubApiService.getUserProfile).toHaveBeenCalledWith(accessToken)
            expect(githubCredentialsRepository.findOne).toHaveBeenCalledWith({
                where: { githubId: userProfile.id },
                relations: ['account']
            })
            expect(githubApiService.getUserPrimaryEmail).toHaveBeenCalledWith(accessToken)
            expect(accountsService.create).toHaveBeenCalledWith({
                nickname: userProfile.name,
                username,
                avatar: userProfile.avatar_url,
                email: primaryEmail,
                permissions: DefaultPermissions
            })
            expect(githubCredentialsService.create).toHaveBeenCalledWith(userProfile.id, account)
            expect(getRandomStringMock).toHaveBeenCalledWith(16, `${LOWER_CASE_ALPHA}${NUMERIC}`)
        })
    })

    describe('loginWithGithub', () => {

        const code = 'code'
        const accessToken = 'access token'
        const userProfile = {
            name: 'user name',
            id: 1
        }

        it('should throw a BadRequestException if no github credentials exists', async () => {

            githubApiService.consumeCodeForAccessToken.mockResolvedValue(accessToken)
            githubApiService.getUserProfile.mockResolvedValue(userProfile)
            // eslint-disable-next-line unicorn/no-null
            githubCredentialsRepository.findOne.mockResolvedValue(null)

            await expect(authService.loginWithGithub(code)).rejects.toStrictEqual(new BadRequestException('This Github account is not associated with an existing account'))

            expect(githubApiService.consumeCodeForAccessToken).toHaveBeenCalledWith(code)
            expect(githubApiService.getUserProfile).toHaveBeenCalledWith(accessToken)
            expect(githubCredentialsRepository.findOne).toHaveBeenCalledWith({
                where: { githubId: userProfile.id },
                relations: ['account']
            })
        })

        it('should return an existing account if a github credentials exists', async () => {

            const credentials = {
                account: 'account'
            }

            githubApiService.consumeCodeForAccessToken.mockResolvedValue(accessToken)
            githubApiService.getUserProfile.mockResolvedValue(userProfile)
            githubCredentialsRepository.findOne.mockResolvedValue(credentials)

            await expect(authService.loginWithGithub(code)).resolves.toBe(credentials.account)

            expect(githubApiService.consumeCodeForAccessToken).toHaveBeenCalledWith(code)
            expect(githubApiService.getUserProfile).toHaveBeenCalledWith(accessToken)
            expect(githubCredentialsRepository.findOne).toHaveBeenCalledWith({
                where: { githubId: userProfile.id },
                relations: ['account']
            })
        })
    })
})
