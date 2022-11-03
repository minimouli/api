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
import type { PutMoulinetteSourceReqDto } from '../dto/put-moulinette-source.req.dto'

describe('MoulinetteSourcesService', () => {

    let moulinetteSourcesService: MoulinetteSourcesService
    const moulinetteRepository = {
        findOne: jest.fn()
    }
    const moulinetteSourceRepository = {
        create: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        remove: jest.fn(),
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
        moulinetteSourceRepository.findOne.mockReset()
        moulinetteSourceRepository.findOneBy.mockReset()
        moulinetteSourceRepository.remove.mockReset()
        moulinetteSourceRepository.save.mockReset()
        httpService.get.mockReset()
        caslAbilityFactory.createForAccount.mockReset()
        caslAbility.can.mockReset()
    })

    describe('put', () => {

        let createSpy: jest.SpyInstance
        let updateSpy: jest.SpyInstance

        const moulinetteId = '1'
        const version: [number, number, number] = [1, 2, 3]
        const [majorVersion, minorVersion, patchVersion] = version
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PutMoulinetteSourceReqDto
        const initiator = { id: '2' } as Account
        const foundMoulinette = 'found moulinette'
        const foundMoulinetteSource = 'found moulinette source'
        const createdMoulinetteSource = 'created moulinette source'
        const updatedMoulinetteSource = 'updated moulinette source'

        beforeEach(() => {
            createSpy = jest.spyOn(moulinetteSourcesService, 'create')
            updateSpy = jest.spyOn(moulinetteSourcesService, 'update')
        })

        it('should throw a NotFoundException if the moulinette id does not belong to an existing moulinette', async () => {

            // eslint-disable-next-line unicorn/no-null
            moulinetteRepository.findOne.mockResolvedValue(null)

            await expect(moulinetteSourcesService.put(moulinetteId, version, body, initiator)).rejects.toThrow(NotFoundException)

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: moulinetteId },
                relations: ['maintainers']
            })
        })

        it('should create a new moulinette source if none with the same version exists so far', async () => {

            moulinetteRepository.findOne.mockResolvedValue(foundMoulinette)
            // eslint-disable-next-line unicorn/no-null
            moulinetteSourceRepository.findOne.mockResolvedValue(null)
            createSpy.mockResolvedValue(createdMoulinetteSource)

            await expect(moulinetteSourcesService.put(moulinetteId, version, body, initiator)).resolves.toBe(createdMoulinetteSource)

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: moulinetteId },
                relations: ['maintainers']
            })
            expect(moulinetteSourceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    majorVersion,
                    minorVersion,
                    patchVersion,
                    moulinette: {
                        id: moulinetteId
                    }
                },
                relations: ['moulinette', 'moulinette.maintainers']
            })
            expect(createSpy).toHaveBeenCalledWith(foundMoulinette, version, body, initiator)
            expect(updateSpy).not.toHaveBeenCalled()
        })

        it('should update an existing moulinette source if one with the same version exists', async () => {

            moulinetteRepository.findOne.mockResolvedValue(foundMoulinette)
            moulinetteSourceRepository.findOne.mockResolvedValue(foundMoulinetteSource)
            updateSpy.mockResolvedValue(updatedMoulinetteSource)

            await expect(moulinetteSourcesService.put(moulinetteId, version, body, initiator)).resolves.toBe(updatedMoulinetteSource)

            expect(moulinetteRepository.findOne).toHaveBeenCalledWith({
                where: { id: moulinetteId },
                relations: ['maintainers']
            })
            expect(moulinetteSourceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    majorVersion,
                    minorVersion,
                    patchVersion,
                    moulinette: {
                        id: moulinetteId
                    }
                },
                relations: ['moulinette', 'moulinette.maintainers']
            })
            expect(createSpy).not.toHaveBeenCalled()
            expect(updateSpy).toHaveBeenCalledWith(foundMoulinetteSource, body, initiator)
        })
    })

    describe('createMoulinetteSource', () => {

        let createChecksumFromWebFileSpy: jest.SpyInstance

        const moulinette = { id: '1' } as Moulinette
        const version: [number, number, number] = [1, 2, 3]
        const [majorVersion, minorVersion, patchVersion] = version
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PutMoulinetteSourceReqDto
        const initiator = { id: '2' } as Account
        const createdMoulinetteSource = 'created moulinette source'
        const savedMoulinetteSource = 'saved moulinette source'
        const checksum = 'checksum'
        const error = 'error'

        beforeEach(() => {
            createChecksumFromWebFileSpy = jest.spyOn(moulinetteSourcesService, 'createChecksumFromWebFile')
        })

        it('should throw a BadRequestRequestException if the creation of the hash fails', async () => {

            createChecksumFromWebFileSpy.mockResolvedValue({ checksum: undefined, error })

            await expect(moulinetteSourcesService.create(moulinette, version, body, initiator)).rejects.toThrow(
                new BadRequestException(error)
            )

            expect(createChecksumFromWebFileSpy).toHaveBeenCalledWith(body.tarball)
        })

        it('should throw a ForbiddenException if the initiator has not the permission to create moulinette sources', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)
            createChecksumFromWebFileSpy.mockResolvedValue({ checksum, error: undefined })
            moulinetteSourceRepository.create.mockReturnValue(createdMoulinetteSource)

            await expect(moulinetteSourcesService.create(moulinette, version, body, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, createdMoulinetteSource)
            expect(createChecksumFromWebFileSpy).toHaveBeenCalledWith(body.tarball)
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
            createChecksumFromWebFileSpy.mockResolvedValue({ checksum, error: undefined })
            moulinetteSourceRepository.create.mockReturnValue(createdMoulinetteSource)
            moulinetteSourceRepository.save.mockResolvedValue(savedMoulinetteSource)

            await expect(moulinetteSourcesService.create(moulinette, version, body, initiator)).resolves.toBe(savedMoulinetteSource)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Create, createdMoulinetteSource)
            expect(createChecksumFromWebFileSpy).toHaveBeenCalledWith(body.tarball)
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

    describe('update', () => {

        let createChecksumFromWebFileSpy: jest.SpyInstance

        const subject = { id: 1 } as MoulinetteSource
        const body = {
            tarball: 'https://example.com/tarball.tar.gz'
        } as PutMoulinetteSourceReqDto
        const initiator = { id: '1' } as Account
        const foundMoulinetteSource = 'found moulinette source'
        const checksum = 'checksum'
        const error = 'error'

        beforeEach(() => {
            createChecksumFromWebFileSpy = jest.spyOn(moulinetteSourcesService, 'createChecksumFromWebFile')
        })

        it('should throw a ForbiddenException if the initiator has not the permission to update moulinette sources', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(moulinetteSourcesService.update(subject, body, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
        })

        it('should throw a BadRequestRequestException if the creation of the hash fails', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            createChecksumFromWebFileSpy.mockResolvedValue({ error, checksum: undefined })

            await expect(moulinetteSourcesService.update(subject, body, initiator)).rejects.toThrow(
                new BadRequestException(error)
            )

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(createChecksumFromWebFileSpy).toHaveBeenCalledWith(body.tarball)
        })

        it('should throw a NotFoundException if the updated moulinette source is not found', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)
            createChecksumFromWebFileSpy.mockResolvedValue({ checksum, error: undefined })
            // eslint-disable-next-line unicorn/no-null
            moulinetteSourceRepository.findOneBy.mockResolvedValue(null)

            await expect(moulinetteSourcesService.update(subject, body, initiator)).rejects.toThrow(NotFoundException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(createChecksumFromWebFileSpy).toHaveBeenCalledWith(body.tarball)
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
            createChecksumFromWebFileSpy.mockResolvedValue({ checksum, error: undefined })
            moulinetteSourceRepository.findOneBy.mockResolvedValue(foundMoulinetteSource)

            await expect(moulinetteSourcesService.update(subject, body, initiator)).resolves.toBe(foundMoulinetteSource)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Update, subject)
            expect(createChecksumFromWebFileSpy).toHaveBeenCalledWith(body.tarball)
            expect(moulinetteSourceRepository.save).toHaveBeenCalledWith({
                ...subject,
                checksum,
                ...body
            })
            expect(moulinetteSourceRepository.findOneBy).toHaveBeenCalledWith({ id: subject.id })
        })
    })

    describe('delete', () => {

        const subject = { id: 1 } as MoulinetteSource
        const initiator = { id: '1' } as Account

        it('should throw a ForbiddenException if the initiator has not the permission to delete moulinette sources', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(false)

            await expect(moulinetteSourcesService.delete(subject, initiator)).rejects.toThrow(ForbiddenException)

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
        })

        it('should delete the moulinette source', async () => {

            caslAbilityFactory.createForAccount.mockReturnValue(caslAbility)
            caslAbility.can.mockReturnValue(true)

            await expect(moulinetteSourcesService.delete(subject, initiator)).resolves.toBeUndefined()

            expect(caslAbilityFactory.createForAccount).toHaveBeenCalledWith(initiator)
            expect(caslAbility.can).toHaveBeenCalledWith(CaslAction.Delete, subject)
            expect(moulinetteSourceRepository.remove).toHaveBeenCalledWith(subject)
        })
    })

    describe('deleteByVersion', () => {

        let deleteSpy: jest.SpyInstance

        const moulinetteId = '1'
        const version: [number, number, number] = [1, 2, 3]
        const [majorVersion, minorVersion, patchVersion] = version
        const initiator = { id: '2' } as Account
        const foundMoulinetteSource = 'found moulinette source'

        beforeEach(() => {
            deleteSpy = jest.spyOn(moulinetteSourcesService, 'delete')
        })

        it('should throw a NotFoundException if moulinette id is not related to a moulinette', async () => {

            // eslint-disable-next-line unicorn/no-null
            moulinetteSourceRepository.findOne.mockResolvedValue(null)

            await expect(moulinetteSourcesService.deleteByVersion(moulinetteId, version, initiator)).rejects.toThrow(NotFoundException)

            expect(moulinetteSourceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    majorVersion,
                    minorVersion,
                    patchVersion,
                    moulinette: {
                        id: moulinetteId
                    }
                },
                relations: ['moulinette', 'moulinette.maintainers']
            })
        })

        it('should delete the project', async () => {

            moulinetteSourceRepository.findOne.mockResolvedValue(foundMoulinetteSource)
            deleteSpy.mockResolvedValue(Promise.resolve())

            await expect(moulinetteSourcesService.deleteByVersion(moulinetteId, version, initiator)).resolves.toBeUndefined()

            expect(moulinetteSourceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    majorVersion,
                    minorVersion,
                    patchVersion,
                    moulinette: {
                        id: moulinetteId
                    }
                },
                relations: ['moulinette', 'moulinette.maintainers']
            })
            expect(deleteSpy).toHaveBeenCalledWith(foundMoulinetteSource, initiator)
        })
    })

    describe('createChecksumFromWebFile', () => {

        const url = 'https://example.com/tarball.tar.gz'

        it('should return an error if the http service returns an error', async () => {

            const observer = new Observable((subscriber) => subscriber.error())
            httpService.get.mockReturnValue(observer)

            await expect(moulinetteSourcesService.createChecksumFromWebFile(url)).resolves.toStrictEqual({
                error: 'Unable to create checksum from the given tarball',
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
