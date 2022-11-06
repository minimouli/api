/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GithubApiService } from './services/github-api.service'
import { GithubCredentialsService } from './services/github-credentials.service'
import { GithubCredentials } from './entities/github-credentials.entity'
import { AccountsService } from '../accounts/accounts.service'
import { DefaultPermissions } from '../common/configs/permissions.config'
import { getRandomString } from '../common/helpers/random.helper'
import { LOWER_CASE_ALPHA, NUMERIC } from '../common/helpers/string.helper'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class AuthService {

    constructor(
        @InjectRepository(GithubCredentials)
        private readonly githubCredentialsRepository: Repository<GithubCredentials>,
        private readonly githubApiService: GithubApiService,
        private readonly githubCredentialsService: GithubCredentialsService,
        private readonly accountsService: AccountsService
    ) {}

    async signupWithGithub(code: string): Promise<Account> {

        const accessToken = await this.githubApiService.consumeCodeForAccessToken(code)
        const userProfile = await this.githubApiService.getUserProfile(accessToken)

        const credentials = await this.githubCredentialsRepository.findOne({
            where: { githubId: userProfile.id },
            relations: ['account']
        })

        if (credentials)
            return credentials.account

        const username = getRandomString(16, `${LOWER_CASE_ALPHA}${NUMERIC}`)
        const email = await this.githubApiService.getUserPrimaryEmail(accessToken)

        const account = await this.accountsService.create({
            nickname: userProfile.name,
            username,
            avatar: userProfile.avatar_url,
            email,
            permissions: DefaultPermissions
        })

        await this.githubCredentialsService.create(userProfile.id, account)

        return account
    }

    async loginWithGithub(code: string): Promise<Account> {

        const accessToken = await this.githubApiService.consumeCodeForAccessToken(code)
        const userProfile = await this.githubApiService.getUserProfile(accessToken)

        const credentials = await this.githubCredentialsRepository.findOne({
            where: { githubId: userProfile.id },
            relations: ['account']
        })

        if (!credentials)
            throw new BadRequestException('This Github account is not associated with an existing account')

        return credentials.account
    }

}

export {
    AuthService
}
