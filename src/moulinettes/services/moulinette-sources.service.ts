/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import crypto from 'node:crypto'
import { HttpService } from '@nestjs/axios'
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Moulinette } from '../entities/moulinette.entity'
import { MoulinetteSource } from '../entities/moulinette-source.entity'
import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
import { CaslAction } from '../../common/enums/casl-action.enum'
import type { PostMoulinetteSourceReqDto } from '../dto/post-moulinette-source.req.dto'
import type { BinaryLike } from 'node:crypto'
import type { Account } from '../../accounts/entities/account.entity'

interface CreateChecksumFromWebFileSuccessResponse {
    checksum: string
    error: undefined
}

interface CreateChecksumFromWebFileFailureResponse {
    error: string
    checksum: undefined
}

type CreateChecksumFromWebFileResponse = CreateChecksumFromWebFileSuccessResponse | CreateChecksumFromWebFileFailureResponse

@Injectable()
class MoulinetteSourcesService {

    constructor(
        @InjectRepository(Moulinette)
        private readonly moulinetteRepository: Repository<Moulinette>,
        @InjectRepository(MoulinetteSource)
        private readonly moulinetteSourceRepository: Repository<MoulinetteSource>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly httpService: HttpService
    ) {}

    async postMoulinetteSource(
        moulinetteId: string,
        version: [number, number, number],
        body: PostMoulinetteSourceReqDto,
        initiator: Account
    ) {

        const moulinette = await this.moulinetteRepository.findOne({
            where: { id: moulinetteId },
            relations: ['maintainers']
        })

        if (moulinette === null)
            throw new NotFoundException()

        const [majorVersion, minorVersion, patchVersion] = version

        const moulinetteSource = await this.moulinetteSourceRepository.findOneBy({
            majorVersion,
            minorVersion,
            patchVersion,
            moulinette: {
                id: moulinetteId
            }
        })

        if (moulinetteSource === null)
            return this.createMoulinetteSource(moulinette, version, body, initiator)

        return this.updateMoulinetteSource(moulinetteSource, body, initiator)
    }

    async createMoulinetteSource(
        moulinette: Moulinette,
        [majorVersion, minorVersion, patchVersion]: [number, number, number],
        body: PostMoulinetteSourceReqDto,
        initiator: Account
    ): Promise<MoulinetteSource> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        const { checksum, error } = await this.createChecksumFromWebFile(body.tarball)

        if (error !== undefined)
            throw new BadRequestException(error)

        const moulinetteSource = this.moulinetteSourceRepository.create({
            majorVersion,
            minorVersion,
            patchVersion,
            moulinette,
            checksum,
            ...body
        })

        if (!ability.can(CaslAction.Create, moulinetteSource))
            throw new ForbiddenException()

        return this.moulinetteSourceRepository.save(moulinetteSource)
    }

    async updateMoulinetteSource(
        subject: MoulinetteSource,
        body: PostMoulinetteSourceReqDto,
        initiator: Account
    ): Promise<MoulinetteSource> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Update, subject))
            throw new ForbiddenException()

        const { checksum, error } = await this.createChecksumFromWebFile(body.tarball)

        if (error !== undefined)
            throw new BadRequestException(error)

        await this.moulinetteSourceRepository.save({
            ...subject,
            checksum,
            ...body
        })

        const foundMoulinetteSource = await this.moulinetteSourceRepository.findOneBy({ id: subject.id })

        if (foundMoulinetteSource === null)
            throw new NotFoundException()

        return foundMoulinetteSource
    }

    createChecksumFromWebFile(url: string): Promise<CreateChecksumFromWebFileResponse> {

        return new Promise((resolve) => {

            const hash = crypto.createHash('sha256')

            this.httpService.get<BinaryLike>(url, {
                headers: {
                    Accept: 'application/octet-stream'
                },
                responseType: 'arraybuffer'
            })
                .subscribe({
                    next: ({ data }) => hash.update(data),
                    error: () => resolve({
                        error: 'Unable to create the checksum from the given tarball',
                        checksum: undefined
                    }),
                    complete: () => resolve({
                        checksum: hash.digest('hex'),
                        error: undefined
                    })
                })
        })
    }

}

export {
    MoulinetteSourcesService
}
