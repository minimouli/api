/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Run } from './entities/run.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Moulinette } from '../moulinettes/entities/moulinette.entity'
import { MoulinetteSource } from '../moulinettes/entities/moulinette-source.entity'
import type { CreateRunReqDto } from './dto/create-run.req.dto'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class RunsService {

    constructor(
        @InjectRepository(Run)
        private readonly runRepository: Repository<Run>,
        @InjectRepository(Moulinette)
        private readonly moulinetteRepository: Repository<Moulinette>,
        @InjectRepository(MoulinetteSource)
        private readonly moulinetteSourceRepository: Repository<MoulinetteSource>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async create(body: CreateRunReqDto, initiator: Account): Promise<Run> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Create, Run))
            throw new ForbiddenException()

        const [moulinetteId, moulinetteVersion] = body.moulinette.split('@')

        const foundMoulinette = await this.moulinetteRepository.findOneBy({
            id: moulinetteId
        })

        if (foundMoulinette === null)
            throw new BadRequestException('The specified moulinette id does not belong to an existing moulinette')

        const [
            majorVersion, minorVersion, patchVersion
        ] = moulinetteVersion.split('.').map((value) => Number.parseInt(value))

        const foundMoulinetteSource = await this.moulinetteSourceRepository.findOne({
            where: {
                majorVersion,
                minorVersion,
                patchVersion,
                moulinette: {
                    id: moulinetteId
                }
            },
            relations: ['moulinette']
        })

        if (foundMoulinetteSource !== null)
            await this.moulinetteSourceRepository.save({
                ...foundMoulinetteSource,
                use: foundMoulinetteSource.use + 1
            })

        const createdRun = this.runRepository.create({
            suites: body.suites,
            moulinette: foundMoulinette,
            moulinetteVersion,
            owner: initiator
        })

        return this.runRepository.save(createdRun)
    }

}

export {
    RunsService
}
