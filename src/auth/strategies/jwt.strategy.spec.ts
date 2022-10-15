/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtStrategy } from './jwt.strategy'
import { Account } from '../../accounts/entities/account.entity'
import { AuthToken } from '../../tokens/entities/auth-token.entity'
import type { JwtPayload } from '../../tokens/types/jwt.type'

describe('JwtStrategy', () => {

    let jwtStrategy: JwtStrategy
    const accountRepository = {
        findOneBy: jest.fn()
    }
    const authTokenRepository = {
        findOneBy: jest.fn(),
        save: jest.fn()
    }
    const configService = {
        get: (key: string) => key
    }

    const systemTime = new Date('2022-01-01T00:00:00.000Z')

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [JwtStrategy]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Account))
                    return accountRepository

                if (token === getRepositoryToken(AuthToken))
                    return authTokenRepository

                if (token === ConfigService)
                    return configService
            })
            .compile()

        jest.useFakeTimers()
        jest.setSystemTime(systemTime)

        jwtStrategy = moduleRef.get(JwtStrategy)

        accountRepository.findOneBy.mockReset()
        authTokenRepository.findOneBy.mockReset()
        authTokenRepository.save.mockReset()
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    describe('validate', () => {

        const payload = {
            jti: 'jti',
            sub: 'sub'
        }
        const account = 'account'
        const authToken = {
            lastActive: 1
        }

        it('should return null if the account is not found', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)
            authTokenRepository.findOneBy.mockResolvedValue(authToken)

            await expect(jwtStrategy.validate(payload as JwtPayload)).resolves.toBeNull()

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: payload.sub })
            expect(authTokenRepository.findOneBy).toHaveBeenCalledWith({ id: payload.jti })
        })

        it('should return null if the auth token is not found', async () => {

            accountRepository.findOneBy.mockResolvedValue(account)
            // eslint-disable-next-line unicorn/no-null
            authTokenRepository.findOneBy.mockResolvedValue(null)

            await expect(jwtStrategy.validate(payload as JwtPayload)).resolves.toBeNull()

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: payload.sub })
            expect(authTokenRepository.findOneBy).toHaveBeenCalledWith({ id: payload.jti })
        })

        it('should return the account and update', async () => {

            accountRepository.findOneBy.mockResolvedValue(account)
            authTokenRepository.findOneBy.mockResolvedValue(authToken)

            await expect(jwtStrategy.validate(payload as JwtPayload)).resolves.toBe(account)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: payload.sub })
            expect(authTokenRepository.findOneBy).toHaveBeenCalledWith({ id: payload.jti })
            expect(authTokenRepository.save).toHaveBeenCalledWith({
                lastActive: new Date(systemTime).toISOString()
            })
        })
    })
})
