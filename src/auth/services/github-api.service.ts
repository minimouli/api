/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { catchError, lastValueFrom, map } from 'rxjs'
import { isArrayEqual } from '../../common/helpers/array.helper'
import type { GitHubAccessTokenDto } from '../types/github-access-token.dto'
import type { GitHubUserDto } from '../types/github-user.dto'
import type { GitHubUserEmailsDto } from '../types/github-user-emails.dto'

@Injectable()
class GitHubApiService {

    private readonly logger = new Logger(GitHubApiService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    async consumeCodeForAccessToken(code: string): Promise<string> {

        const url = new URL('https://github.com/login/oauth/access_token')
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        const body = JSON.stringify({
            client_id: this.configService.get<string>('GITHUB_OAUTH2_CLIENT_ID'),
            client_secret: this.configService.get<string>('GITHUB_OAUTH2_CLIENT_SECRET'),
            code
        })

        const observable = this.httpService.post<GitHubAccessTokenDto>(url.href, body, { headers })
            .pipe(
                catchError((error) => {
                    this.logger.error('GitHub access token endpoint returns a non 200 code')
                    this.logger.error(error)
                    throw new BadRequestException('Unable to signup or login with GitHub')
                }),
                map((response) => response.data)
            )

        const response = await lastValueFrom(observable)

        if (response.error !== undefined)
            throw new BadRequestException('Unable to signup or login with GitHub, the provided code may be invalid or already used')

        const { access_token, token_type, scope } = response
        const expectedScopes = this.configService.get<string>('GITHUB_OAUTH2_REQUIRED_SCOPES')?.split(',') ?? []

        if (token_type !== 'bearer')
            throw new BadRequestException('Unable to signup or login with GitHub, the received token is not a bearer')

        if (!isArrayEqual(scope.split(','), expectedScopes))
            throw new BadRequestException('Unable to signup or login with GitHub, provided scopes different from those expected')

        return access_token
    }

    async getUserProfile(accessToken: string): Promise<GitHubUserDto> {

        const url = new URL('https://api.github.com/user')
        const headers = {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`
        }

        const observable = this.httpService.get<GitHubUserDto>(url.href, { headers })
            .pipe(
                catchError((error) => {
                    this.logger.error('GitHub user profile endpoint returns a non 200 code')
                    this.logger.error(error)
                    throw new BadRequestException('Unable to retrieve the GitHub user profile')
                }),
                map((response) => response.data)
            )

        return lastValueFrom(observable)
    }

    async getUserPrimaryEmail(accessToken: string): Promise<string> {

        const url = new URL('https://api.github.com/user/emails')
        const headers = {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`
        }

        const observable = this.httpService.get<GitHubUserEmailsDto>(url.href, { headers })
            .pipe(
                catchError((error) => {
                    this.logger.error('GitHub user emails endpoint returns a non 200 code')
                    this.logger.error(error)
                    throw new BadRequestException('Unable to retrieve the GitHub user emails')
                }),
                map((response) => response.data)
            )

        const emails = await lastValueFrom(observable)
        const primaryEmail = emails.find((email) => email.primary)

        if (primaryEmail !== undefined)
            return primaryEmail.email

        return emails.at(0)?.email ?? ''
    }

}

export {
    GitHubApiService
}
