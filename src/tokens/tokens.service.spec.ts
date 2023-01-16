/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { LessThanOrEqual } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { TokensService } from './tokens.service'
import { AuthToken } from './entities/auth-token.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'

jest.mock('typeorm-cursor-pagination')

describe('TokensService', () => {

    let tokensService: TokensService
    const accountRepository = {
        findOneBy: jest.fn()
    }
    const authTokenRepository = {
        create: jest.fn(),
        createQueryBuilder: jest.fn(),
        delete: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
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
    const queryBuilder = {
        leftJoinAndSelect: jest.fn(),
        where: jest.fn()
    }
    const paginator = {
        paginate: jest.fn()
    }
    const buildPaginatorMock = buildPaginator as jest.Mock

    const systemTime = new Date('2022-01-01T00:00:00.000Z')

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [TokensService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Account))
                    return accountRepository

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

        accountRepository.findOneBy.mockReset()
        authTokenRepository.create.mockReset()
        authTokenRepository.createQueryBuilder.mockReset()
        authTokenRepository.delete.mockReset()
        authTokenRepository.findOne.mockReset()
        authTokenRepository.remove.mockReset()
        authTokenRepository.save.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
        configService.get.mockReset()
        jwtService.sign.mockReset()
        queryBuilder.leftJoinAndSelect.mockReset()
        paginator.paginate.mockReset()
        buildPaginatorMock.mockReset()
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

    describe('listAuthTokensFromAccountId', () => {

        const ownerId = 'owner id'
        const initiator = { id: '1' } as Account
        const query = {
            limit: 20
        }
        const owner = { id: '2' } as Account
        const authToken = 'auth token'
        const pagingResult = {
            data: [authToken]
        }

        it('should throw a NotFoundException if the owner id is not related to an existing account', async () => {

            // eslint-disable-next-line unicorn/no-null
            accountRepository.findOneBy.mockResolvedValue(null)

            await expect(tokensService.listAuthTokensFromAccountId(ownerId, query, initiator)).rejects.toThrow(new NotFoundException())

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({
                id: ownerId
            })
        })

        it('should throw a ForbiddenException if the account has not the permission to read auth tokens', async () => {

            accountRepository.findOneBy.mockResolvedValue(owner)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            authTokenRepository.createQueryBuilder.mockReturnValue(queryBuilder)
            queryBuilder.where.mockReturnValue(queryBuilder)
            queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder)
            paginator.paginate.mockResolvedValue(pagingResult)
            caslAbility.can.mockReturnValue(false)
            buildPaginatorMock.mockReturnValue(paginator)

            await expect(tokensService.listAuthTokensFromAccountId(ownerId, query, initiator)).rejects.toThrow(new ForbiddenException())

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({
                id: ownerId
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(authTokenRepository.createQueryBuilder).toHaveBeenCalledWith('authToken')
            expect(queryBuilder.where).toHaveBeenCalledWith('authToken.account.id = :ownerId', { ownerId })
            expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('authToken.account', 'account')
            expect(buildPaginator).toHaveBeenCalledWith({
                entity: AuthToken,
                paginationKeys: ['id'],
                alias: 'authToken',
                query
            })
            expect(paginator.paginate).toHaveBeenCalledWith(queryBuilder)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Read, authToken)
        })

        it('should return all auth tokens', async () => {

            accountRepository.findOneBy.mockResolvedValue(owner)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            authTokenRepository.createQueryBuilder.mockReturnValue(queryBuilder)
            queryBuilder.where.mockReturnValue(queryBuilder)
            queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder)
            paginator.paginate.mockResolvedValue(pagingResult)
            caslAbility.can.mockReturnValue(true)
            buildPaginatorMock.mockReturnValue(paginator)

            await expect(tokensService.listAuthTokensFromAccountId(ownerId, query, initiator)).resolves.toStrictEqual(pagingResult)

            expect(accountRepository.findOneBy).toHaveBeenCalledWith({
                id: ownerId
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(authTokenRepository.createQueryBuilder).toHaveBeenCalledWith('authToken')
            expect(queryBuilder.where).toHaveBeenCalledWith('authToken.account.id = :ownerId', { ownerId })
            expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('authToken.account', 'account')
            expect(buildPaginator).toHaveBeenCalledWith({
                entity: AuthToken,
                paginationKeys: ['id'],
                alias: 'authToken',
                query
            })
            expect(paginator.paginate).toHaveBeenCalledWith(queryBuilder)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Read, authToken)
        })
    })

    describe('deleteAuthTokenById', () => {

        const subjectId = 'subject id'
        const initiator = new Account()
        const authToken = 'auth token'

        it('should throw a NotFoundException if the auth token is not found', async () => {

            // eslint-disable-next-line unicorn/no-null
            authTokenRepository.findOne.mockResolvedValue(null)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)

            await expect(tokensService.deleteAuthTokenById(subjectId, initiator)).rejects.toThrow(new NotFoundException())

            expect(authTokenRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: subjectId
                },
                relations: ['account']
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
        })

        it('should throw a ForbiddenException if the account has not the permission to delete auth tokens', async () => {

            authTokenRepository.findOne.mockResolvedValue(authToken)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(tokensService.deleteAuthTokenById(subjectId, initiator)).rejects.toThrow(new ForbiddenException())

            expect(authTokenRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: subjectId
                },
                relations: ['account']
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, authToken)
        })

        it('should delete the auth token', async () => {

            authTokenRepository.findOne.mockResolvedValue(authToken)
            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(tokensService.deleteAuthTokenById(subjectId, initiator)).resolves.toBeUndefined()

            expect(authTokenRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: subjectId
                },
                relations: ['account']
            })
            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, authToken)
            expect(authTokenRepository.remove).toHaveBeenCalledWith(authToken)
        })
    })

    describe('handleRemoveExpiredAuthTokens', () => {

        it('should delete all expired auth tokens', async () => {

            await expect(tokensService.handleRemoveExpiredAuthTokens()).resolves.toBeUndefined()

            expect(authTokenRepository.delete).toHaveBeenCalledWith({
                expiresAt: LessThanOrEqual(systemTime.toISOString())
            })
        })
    })
})
