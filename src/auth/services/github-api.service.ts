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
import type { GithubAccessTokenDto } from '../types/github-access-token.dto'
import type { GithubUserDto } from '../types/github-user.dto'
import type { GithubUserEmailsDto } from '../types/github-user-emails.dto'

@Injectable()
class GithubApiService {

    private readonly logger = new Logger(GithubApiService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    async consumeCodeForAccessToken(code: string): Promise<string> {

        const url = new URL(this.configService.get('GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT') ?? '')
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        const body = JSON.stringify({
            client_id: this.configService.get<string>('GITHUB_OAUTH2_CLIENT_ID'),
            client_secret: this.configService.get<string>('GITHUB_OAUTH2_CLIENT_SECRET'),
            code
        })

        const observable = this.httpService.post<GithubAccessTokenDto>(url.href, body, { headers })
            .pipe(
                catchError((error) => {
                    this.logger.error('Github access token endpoint returns a non 200 code')
                    this.logger.error(error)
                    throw new BadRequestException('Unable to signup or login with Github')
                }),
                map((response) => response.data)
            )

        const response = await lastValueFrom(observable)

        if (response.error !== undefined)
            throw new BadRequestException('Unable to signup or login with Github, the provided code may be invalid or already used')

        const { access_token, token_type, scope } = response
        const expectedScopes = this.configService.get<string>('GITHUB_OAUTH2_REQUIRED_SCOPES')?.split(',') ?? []

        if (token_type !== 'bearer')
            throw new BadRequestException('Unable to signup or login with Github, the received token is not a bearer')

        if (!isArrayEqual(scope.split(','), expectedScopes))
            throw new BadRequestException('Unable to signup or login with Github, provided scopes different from those expected')

        return access_token
    }

    async getUserProfile(accessToken: string): Promise<GithubUserDto> {

        const url = new URL(this.configService.get('GITHUB_API_USER_PROFILE_ENDPOINT') ?? '')
        const headers = {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`
        }

        const observable = this.httpService.get<GithubUserDto>(url.href, { headers })
            .pipe(
                catchError((error) => {
                    this.logger.error('Github user profile endpoint returns a non 200 code')
                    this.logger.error(error)
                    throw new BadRequestException('Unable to retrieve the Github user profile')
                }),
                map((response) => response.data)
            )

        return lastValueFrom(observable)
    }

    async getUserPrimaryEmail(accessToken: string): Promise<string> {

        const url = new URL(this.configService.get('GITHUB_API_USER_EMAILS_ENDPOINT') ?? '')
        const headers = {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`
        }

        const observable = this.httpService.get<GithubUserEmailsDto>(url.href, { headers })
            .pipe(
                catchError((error) => {
                    this.logger.error('Github user emails endpoint returns a non 200 code')
                    this.logger.error(error)
                    throw new BadRequestException('Unable to retrieve the Github user emails')
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
    GithubApiService
}
