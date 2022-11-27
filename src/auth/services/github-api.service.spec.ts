/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HttpService } from '@nestjs/axios'
import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { Observable } from 'rxjs'
import { GitHubApiService } from './github-api.service'

describe('GitHubApiService', () => {

    let githubApiService: GitHubApiService
    const configService = {
        get: jest.fn()
    }
    const httpService = {
        get: jest.fn(),
        post: jest.fn()
    }
    const logger = {
        error: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [GitHubApiService]
        })
            .useMocker((token) => {
                if (token === ConfigService)
                    return configService

                if (token === HttpService)
                    return httpService
            })
            .compile()

        githubApiService = moduleRef.get(GitHubApiService)
        // eslint-disable-next-line @typescript-eslint/dot-notation
        jest.spyOn(githubApiService['logger'], 'error').mockImplementation(logger.error)

        configService.get.mockReset()
        httpService.get.mockReset()
        httpService.post.mockReset()
        logger.error.mockReset()
    })

    describe('consumeCodeForAccessToken', () => {

        const url = 'https://domain.com/'
        const code = 'github-code'
        const access_token = 'access-token'
        const token_type = 'bearer'
        const scope = 'GITHUB_OAUTH2_REQUIRED_SCOPES'

        it('should throw an error if the url is invalid', async () => {
            await expect(githubApiService.consumeCodeForAccessToken(code)).rejects.toThrow('Invalid URL')
        })

        it('should throw a BadRequestException if HttpService.post throws an error', async () => {

            const errorMessage = 'error message'

            const observable = new Observable((subscriber) => {
                subscriber.error(new Error(errorMessage))
                subscriber.complete()
            })

            httpService.post.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.consumeCodeForAccessToken(code)).rejects.toThrow(
                new BadRequestException('Unable to signup or login with GitHub')
            )

            expect(httpService.post).toHaveBeenCalledWith(url, JSON.stringify({
                client_id: 'GITHUB_OAUTH2_CLIENT_ID',
                client_secret: 'GITHUB_OAUTH2_CLIENT_SECRET',
                code
            }), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            expect(logger.error).toHaveBeenCalledWith('GitHub access token endpoint returns a non 200 code')
            expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage))
        })

        it('should throw a BadRequestException if the response contains an error', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: {
                        error: 'error'
                    }
                })
                subscriber.complete()
            })

            httpService.post.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.consumeCodeForAccessToken(code)).rejects.toThrow(
                new BadRequestException('Unable to signup or login with GitHub, the provided code may be invalid or already used')
            )

            expect(httpService.post).toHaveBeenCalledWith(url, JSON.stringify({
                client_id: 'GITHUB_OAUTH2_CLIENT_ID',
                client_secret: 'GITHUB_OAUTH2_CLIENT_SECRET',
                code
            }), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        })

        it('should throw a BadRequestException if the returned token is not a bearer', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: {
                        access_token,
                        token_type: 'unknown type',
                        scope
                    }
                })
                subscriber.complete()
            })

            httpService.post.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.consumeCodeForAccessToken(code)).rejects.toThrow(
                new BadRequestException('Unable to signup or login with GitHub, the received token is not a bearer')
            )

            expect(httpService.post).toHaveBeenCalledWith(url, JSON.stringify({
                client_id: 'GITHUB_OAUTH2_CLIENT_ID',
                client_secret: 'GITHUB_OAUTH2_CLIENT_SECRET',
                code
            }), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        })

        it('should throw a BadRequestException if the provided scopes are different from those expected', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: {
                        access_token,
                        token_type,
                        scope: 'different scopes'
                    }
                })
                subscriber.complete()
            })

            httpService.post.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.consumeCodeForAccessToken(code)).rejects.toThrow(
                new BadRequestException('Unable to signup or login with GitHub, provided scopes different from those expected')
            )

            expect(httpService.post).toHaveBeenCalledWith(url, JSON.stringify({
                client_id: 'GITHUB_OAUTH2_CLIENT_ID',
                client_secret: 'GITHUB_OAUTH2_CLIENT_SECRET',
                code
            }), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        })

        it('should throw a BadRequestException if the env var GITHUB_OAUTH2_REQUIRED_SCOPES is not defined', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: {
                        access_token,
                        token_type,
                        scope: 'GITHUB_OAUTH2_REQUIRED_SCOPES'
                    }
                })
                subscriber.complete()
            })

            httpService.post.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT')
                    return url
                if (key !== 'GITHUB_OAUTH2_REQUIRED_SCOPES')
                    return key
            })

            await expect(githubApiService.consumeCodeForAccessToken(code)).rejects.toThrow(
                new BadRequestException('Unable to signup or login with GitHub, provided scopes different from those expected')
            )

            expect(httpService.post).toHaveBeenCalledWith(url, JSON.stringify({
                client_id: 'GITHUB_OAUTH2_CLIENT_ID',
                client_secret: 'GITHUB_OAUTH2_CLIENT_SECRET',
                code
            }), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        })

        it('should return the access token', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: {
                        access_token,
                        token_type,
                        scope
                    }
                })
                subscriber.complete()
            })

            httpService.post.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.consumeCodeForAccessToken(code)).resolves.toBe(access_token)

            expect(httpService.post).toHaveBeenCalledWith(url, JSON.stringify({
                client_id: 'GITHUB_OAUTH2_CLIENT_ID',
                client_secret: 'GITHUB_OAUTH2_CLIENT_SECRET',
                code
            }), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        })
    })

    describe('getUserProfile', () => {

        const url = 'https://domain.com/'
        const accessToken = 'access-token'

        it('should throw an error if the url is invalid', async () => {
            await expect(githubApiService.getUserProfile(accessToken)).rejects.toThrow('Invalid URL')
        })

        it('should throw a BadRequestException if if HttpService.get throws an error', async () => {

            const errorMessage = 'error message'

            const observable = new Observable((subscriber) => {
                subscriber.error(new Error(errorMessage))
                subscriber.complete()
            })

            httpService.get.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_API_USER_PROFILE_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.getUserProfile(accessToken)).rejects.toThrow(
                new BadRequestException('Unable to retrieve the GitHub user profile')
            )

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
            expect(logger.error).toHaveBeenCalledWith('GitHub user profile endpoint returns a non 200 code')
            expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage))
        })

        it('should return the returned data', async () => {

            const data = 'data'

            const observable = new Observable((subscriber) => {
                subscriber.next({ data })
                subscriber.complete()
            })

            httpService.get.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_API_USER_PROFILE_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.getUserProfile(accessToken)).resolves.toBe(data)

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        })
    })

    describe('getUserPrimaryEmail', () => {

        const url = 'https://domain.com/'
        const accessToken = 'access-token'

        it('should throw an error if the url is invalid', async () => {
            await expect(githubApiService.getUserPrimaryEmail(accessToken)).rejects.toThrow('Invalid URL')
        })

        it('should throw a BadRequestException if if HttpService.get throws an error', async () => {

            const errorMessage = 'error message'

            const observable = new Observable((subscriber) => {
                subscriber.error(new Error(errorMessage))
                subscriber.complete()
            })

            httpService.get.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_API_USER_EMAILS_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.getUserPrimaryEmail(accessToken)).rejects.toThrow(
                new BadRequestException('Unable to retrieve the GitHub user emails')
            )

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
            expect(logger.error).toHaveBeenCalledWith('GitHub user emails endpoint returns a non 200 code')
            expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage))
        })

        it('should return the primary email from the returned email list', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: [
                        { email: 'email1', primary: false },
                        { email: 'email2', primary: false },
                        { email: 'email3', primary: true }
                    ]
                })
                subscriber.complete()
            })

            httpService.get.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_API_USER_EMAILS_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.getUserPrimaryEmail(accessToken)).resolves.toBe('email3')

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        })

        it('should return the first email if not primary email is available in the returned email list', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: [
                        { email: 'email1', primary: false },
                        { email: 'email2', primary: false },
                        { email: 'email3', primary: false }
                    ]
                })
                subscriber.complete()
            })

            httpService.get.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_API_USER_EMAILS_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.getUserPrimaryEmail(accessToken)).resolves.toBe('email1')

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        })

        it('should return an empty string if no email is returned', async () => {

            const observable = new Observable((subscriber) => {
                subscriber.next({
                    data: []
                })
                subscriber.complete()
            })

            httpService.get.mockReturnValue(observable)
            configService.get.mockImplementation((key: string) => {
                if (key === 'GITHUB_API_USER_EMAILS_ENDPOINT')
                    return url
                return key
            })

            await expect(githubApiService.getUserPrimaryEmail(accessToken)).resolves.toBe('')

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        })
    })
})
