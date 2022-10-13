/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ForbiddenException } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { AuthToken } from './entities/auth-token.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'

describe('TokensService', () => {

    let tokensService: TokensService
    const authTokenRepository = {
        create: jest.fn(),
        find: jest.fn(),
        save: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }
    const caslAbility = {
        can: jest.fn()
    }
    const configService = {
        get: jest.fn()
    }
    const jwtService = {
        sign: jest.fn()
    }

    const systemTime = new Date('2022-01-01T00:00:00.000Z')

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [TokensService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(AuthToken))
                    return authTokenRepository

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory

                if (token === ConfigService)
                    return configService

                if (token === JwtService)
                    return jwtService
            })
            .compile()

        jest.useFakeTimers()
        jest.setSystemTime(systemTime)

        tokensService = moduleRef.get(TokensService)

        authTokenRepository.create.mockReset()
        authTokenRepository.find.mockReset()
        authTokenRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
        configService.get.mockReset()
        jwtService.sign.mockReset()
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    describe('create', () => {

        const name = 'name'
        const account = new Account()
        const createdAuthToken = { id: 1 }
        const savedAuthToken = {
            id: 2,
            account: { id: 3 }
        }
        const jwt = 'jwt'

        it('should return an auth token and a jwt', async () => {

            const expiresIn = '2h'
            const expiresAt = '2022-01-01T02:00:00.000Z'

            authTokenRepository.create.mockReturnValue(createdAuthToken)
            authTokenRepository.save.mockResolvedValue(savedAuthToken)
            // eslint-disable-next-line max-nested-callbacks
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_OPTION_EXPIRES_IN')
                    return expiresIn
                return key
            })
            jwtService.sign.mockReturnValue(jwt)

            await expect(tokensService.create(name, account)).resolves.toStrictEqual([savedAuthToken, jwt])

            expect(authTokenRepository.create).toHaveBeenCalledWith({
                name,
                account,
                expiresAt
            })
            expect(authTokenRepository.save).toHaveBeenCalledWith(createdAuthToken)
            expect(jwtService.sign).toHaveBeenCalledWith({
                jti: savedAuthToken.id,
                sub: savedAuthToken.account.id
            }, {
                expiresIn
            })
        })

        it('should return an auth token and a jwt if the JWT_OPTION_EXPIRES_IN env var is not defined', async () => {

            const expiresIn = '1h'
            const expiresAt = '2022-01-01T01:00:00.000Z'

            authTokenRepository.create.mockReturnValue(createdAuthToken)
            authTokenRepository.save.mockResolvedValue(savedAuthToken)
            jwtService.sign.mockReturnValue(jwt)

            await expect(tokensService.create(name, account)).resolves.toStrictEqual([savedAuthToken, jwt])

            expect(authTokenRepository.create).toHaveBeenCalledWith({
                name,
                account,
                expiresAt
            })
            expect(authTokenRepository.save).toHaveBeenCalledWith(createdAuthToken)
            expect(jwtService.sign).toHaveBeenCalledWith({
                jti: savedAuthToken.id,
                sub: savedAuthToken.account.id
            }, {
                expiresIn
            })
        })
    })

    describe('getAllAuthTokensOf', () => {

        const ownerId = 'owner id'
        const initiator = new Account()
        const authToken = 'auth token'
        const authTokens = [authToken]

        it('should throw a ForbiddenException the account has not the permission to read auth tokens', async () => {

            authTokenRepository.find.mockResolvedValue(authTokens)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(tokensService.getAllAuthTokensOf(ownerId, initiator)).rejects.toThrow(new ForbiddenException())

            expect(authTokenRepository.find).toHaveBeenCalledWith({
                where: {
                    account: {
                        id: ownerId
                    }
                },
                relations: ['account']
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Read, authToken)
        })

        it('should return all auth tokens', async () => {

            authTokenRepository.find.mockResolvedValue(authTokens)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(tokensService.getAllAuthTokensOf(ownerId, initiator)).resolves.toStrictEqual(authTokens)

            expect(authTokenRepository.find).toHaveBeenCalledWith({
                where: {
                    account: {
                        id: ownerId
                    }
                },
                relations: ['account']
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Read, authToken)
        })
    })
})
