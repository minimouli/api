/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import crypto from 'node:crypto'
import { HttpService } from '@nestjs/axios'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Observable } from 'rxjs'
import { MoulinetteSourcesService } from './moulinette-sources.service'
import { Moulinette } from '../entities/moulinette.entity'
import { MoulinetteSource } from '../entities/moulinette-source.entity'
import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
import { CaslAction } from '../../common/enums/casl-action.enum'
import type { Account } from '../../accounts/entities/account.entity'
import type { PostMoulinetteSourceReqDto } from '../dto/post-moulinette-source.req.dto'

describe('MoulinetteSourcesService', () => {

    let moulinetteSourcesService: MoulinetteSourcesService
    const moulinetteRepository = {
        findOne: jest.fn()
    }
    const moulinetteSourceRepository = {
        create: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn()
    }
    const httpService = {
        get: jest.fn()
    }
    const caslAbilityFactory = {
        createForAccount: jest.fn()
    }
    const caslAbility = {
        can: jest.fn()
    }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [MoulinetteSourcesService]
        })
            .useMocker((token) => {
                if (token === getRepositoryToken(Moulinette))
                    return moulinetteRepository

                if (token === getRepositoryToken(MoulinetteSource))
                    return moulinetteSourceRepository

                if (token === HttpService)
                    return httpService

                if (token === CaslAbilityFactory)
                    return caslAbilityFactory
            })
            .compile()

        moulinetteSourcesService = moduleRef.get(MoulinetteSourcesService)

        moulinetteRepository.findOne.mockReset()
        moulinetteSourceRepository.create.mockReset()
        moulinetteSourceRepository.findOneBy.mockReset()
        moulinetteSourceRepository.save.mockReset()
        httpService.get.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
    })

    describe('postMoulinetteSource', () => {

        let createMoulinetteSource: jest.SpyInstance
        let updateMoulinetteSource: jest.SpyInstance

        const moulinetteId = '1'
        const version: [number, number, number] = [1, 2, 3]
        const [majorVersion, minorVersion, patchVersion] = version
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PostMoulinetteSourceReqDto
        const initiator = { id: '2' } as Account
        const foundMoulinette = 'found moulinette'
        const foundMoulinetteSource = 'found moulinette source'
        const createdMoulinetteSource = 'created moulinette source'
        const updatedMoulinetteSource = 'updated moulinette source'

        beforeEach(() => {
            createMoulinetteSource = jest.spyOn(moulinetteSourcesService, 'createMoulinetteSource')
            updateMoulinetteSource = jest.spyOn(moulinetteSourcesService, 'updateMoulinetteSource')
        })

        it('should throw a NotFoundException if the moulinette id does not belong to an existing moulinette', async () => {

            // eslint-disable-next-line unicorn/no-null
            moulinetteRepository.findOne.mockResolvedValue(null)

            await expect(moulinetteSourcesService.postMoulinetteSource(moulinetteId, version, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: moulinetteId },
                relations: ['maintainers']
            })
        })

        it('should create a new moulinette source if none with the same version exists so far', async () => {

            moulinetteRepository.findOne.mockResolvedValue(foundMoulinette)
            // eslint-disable-next-line unicorn/no-null
            moulinetteSourceRepository.findOneBy.mockResolvedValue(null)
            createMoulinetteSource.mockResolvedValue(createdMoulinetteSource)

            await expect(moulinetteSourcesService.postMoulinetteSource(moulinetteId, version, body, initiator)).resolves.toBe(createdMoulinetteSource)

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: moulinetteId },
                relations: ['maintainers']
            })
            expect(moulinetteSourceRepository.findOneBy).toHaveBeenCalledWith({
                majorVersion,
                minorVersion,
                patchVersion,
                moulinette: {
                    id: moulinetteId
                }
            })
            expect(createMoulinetteSource).toHaveBeenCalledWith(foundMoulinette, version, body, initiator)
            expect(updateMoulinetteSource).not.toHaveBeenCalled()
        })

        it('should update an existing moulinette source if one with the same version exists', async () => {

            moulinetteRepository.findOne.mockResolvedValue(foundMoulinette)
            moulinetteSourceRepository.findOneBy.mockResolvedValue(foundMoulinetteSource)
            updateMoulinetteSource.mockResolvedValue(updatedMoulinetteSource)

            await expect(moulinetteSourcesService.postMoulinetteSource(moulinetteId, version, body, initiator)).resolves.toBe(updatedMoulinetteSource)

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: moulinetteId },
                relations: ['maintainers']
            })
            expect(moulinetteSourceRepository.findOneBy).toHaveBeenCalledWith({
                majorVersion,
                minorVersion,
                patchVersion,
                moulinette: {
                    id: moulinetteId
                }
            })
            expect(createMoulinetteSource).not.toHaveBeenCalled()
            expect(updateMoulinetteSource).toHaveBeenCalledWith(foundMoulinetteSource, body, initiator)
        })
    })

    describe('createMoulinetteSource', () => {

        let createChecksumFromWebFile: jest.SpyInstance

        const moulinette = { id: '1' } as Moulinette
        const version: [number, number, number] = [1, 2, 3]
        const [majorVersion, minorVersion, patchVersion] = version
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PostMoulinetteSourceReqDto
        const initiator = { id: '2' } as Account
        const createdMoulinetteSource = 'created moulinette source'
        const savedMoulinetteSource = 'saved moulinette source'
        const checksum = 'checksum'
        const error = 'error'

        beforeEach(() => {
            createChecksumFromWebFile = jest.spyOn(moulinetteSourcesService, 'createChecksumFromWebFile')
        })

        it('should throw a BadRequestRequestException if the creation of the hash fails', async () => {

            createChecksumFromWebFile.mockResolvedValue({ checksum: undefined, error })

            await expect(moulinetteSourcesService.createMoulinetteSource(moulinette, version, body, initiator)).rejects.toThrow(
                new BadRequestException(error)
            )

            expect(createChecksumFromWebFile).toHaveBeenCalledWith(body.tarball)
        })

        it('should throw a ForbiddenException if the initiator has not the permission to create moulinette sources', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)
            createChecksumFromWebFile.mockResolvedValue({ checksum, error: undefined })
            moulinetteSourceRepository.create.mockReturnValue(createdMoulinetteSource)

            await expect(moulinetteSourcesService.createMoulinetteSource(moulinette, version, body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, createdMoulinetteSource)
            expect(createChecksumFromWebFile).toHaveBeenCalledWith(body.tarball)
            expect(moulinetteSourceRepository.create).toHaveBeenCalledWith({
                majorVersion,
                minorVersion,
                patchVersion,
                moulinette,
                checksum,
                ...body
            })
        })

        it('should return the saved moulinette source', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            createChecksumFromWebFile.mockResolvedValue({ checksum, error: undefined })
            moulinetteSourceRepository.create.mockReturnValue(createdMoulinetteSource)
            moulinetteSourceRepository.save.mockResolvedValue(savedMoulinetteSource)

            await expect(moulinetteSourcesService.createMoulinetteSource(moulinette, version, body, initiator)).resolves.toBe(savedMoulinetteSource)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, createdMoulinetteSource)
            expect(createChecksumFromWebFile).toHaveBeenCalledWith(body.tarball)
            expect(moulinetteSourceRepository.create).toHaveBeenCalledWith({
                majorVersion,
                minorVersion,
                patchVersion,
                moulinette,
                checksum,
                ...body
            })
            expect(moulinetteSourceRepository.save).toHaveBeenCalledWith(createdMoulinetteSource)
        })
    })

    describe('updateMoulinetteSource', () => {

        let createChecksumFromWebFile: jest.SpyInstance

        const subject = { id: 1 } as MoulinetteSource
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PostMoulinetteSourceReqDto
        const initiator = { id: '1' } as Account
        const foundMoulinetteSource = 'found moulinette source'
        const checksum = 'checksum'
        const error = 'error'

        beforeEach(() => {
            createChecksumFromWebFile = jest.spyOn(moulinetteSourcesService, 'createChecksumFromWebFile')
        })

        it('should throw a ForbiddenException if the initiator has not the permission to update moulinette sources', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(moulinetteSourcesService.updateMoulinetteSource(subject, body, initiator)).rejects.toThrow(new ForbiddenException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should throw a BadRequestRequestException if the creation of the hash fails', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            createChecksumFromWebFile.mockResolvedValue({ error, checksum: undefined })

            await expect(moulinetteSourcesService.updateMoulinetteSource(subject, body, initiator)).rejects.toThrow(
                new BadRequestException(error)
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(createChecksumFromWebFile).toHaveBeenCalledWith(body.tarball)
        })

        it('should throw a NotFoundException if the updated moulinette source is not found', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            createChecksumFromWebFile.mockResolvedValue({ checksum, error: undefined })
            // eslint-disable-next-line unicorn/no-null
            moulinetteSourceRepository.findOneBy.mockResolvedValue(null)

            await expect(moulinetteSourcesService.updateMoulinetteSource(subject, body, initiator)).rejects.toThrow(new NotFoundException())

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(createChecksumFromWebFile).toHaveBeenCalledWith(body.tarball)
            expect(moulinetteSourceRepository.save).toHaveBeenCalledWith({
                ...subject,
                checksum,
                ...body
            })
            expect(moulinetteSourceRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })

        it('should return the updated moulinette source', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            createChecksumFromWebFile.mockResolvedValue({ checksum, error: undefined })
            moulinetteSourceRepository.findOneBy.mockResolvedValue(foundMoulinetteSource)

            await expect(moulinetteSourcesService.updateMoulinetteSource(subject, body, initiator)).resolves.toBe(foundMoulinetteSource)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(createChecksumFromWebFile).toHaveBeenCalledWith(body.tarball)
            expect(moulinetteSourceRepository.save).toHaveBeenCalledWith({
                ...subject,
                checksum,
                ...body
            })
            expect(moulinetteSourceRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })
    })

    describe('createChecksumFromWebFile', () => {

        const url = 'https://example.com/tarball.tar.gz'

        it('should return an error if the http service returns an error', async () => {

            const observer = new Observable((subscriber) => subscriber.error())
            httpService.get.mockReturnValue(observer)

            await expect(moulinetteSourcesService.createChecksumFromWebFile(url)).resolves.toStrictEqual({
                error: 'Unable to create the checksum from the given tarball',
                checksum: undefined
            })

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/octet-stream'
                },
                responseType: 'arraybuffer'
            })
        })

        it('should return the correct checksum', async () => {

            const observer = new Observable((subscriber) => {
                subscriber.next({ data: 'hello' })
                subscriber.next({ data: 'world' })
                subscriber.complete()
            })
            httpService.get.mockReturnValue(observer)

            const hash = crypto.createHash('sha256')
            hash.update('hello')
            hash.update('world')
            const checksum = hash.digest('hex')

            await expect(moulinetteSourcesService.createChecksumFromWebFile(url)).resolves.toStrictEqual({
                checksum,
                error: undefined
            })

            expect(httpService.get).toHaveBeenCalledWith(url, {
                headers: {
                    Accept: 'application/octet-stream'
                },
                responseType: 'arraybuffer'
            })
        })
    })
})
