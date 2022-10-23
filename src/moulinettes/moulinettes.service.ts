/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Moulinette } from './entities/moulinette.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Project } from '../projects/entities/project.entity'
import type { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'

@Injectable()
class MoulinettesService {

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(Moulinette)
        private readonly moulinetteRepository: Repository<Moulinette>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async createMoulinette(body: CreateMoulinetteReqDto, initiator: Account): Promise<Moulinette> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Create, Moulinette))
            throw new ForbiddenException()

        const foundProject = await this.projectRepository.findOneBy({
            id: body.project
        })

        if (foundProject === null)
            throw new BadRequestException('The specified project id does not belong to an existing project')

        const maintainers = await Promise.all(body.maintainers.map(async (id) => this.accountRepository.findOneBy({ id })))

        // eslint-disable-next-line unicorn/no-null
        if (maintainers.includes(null))
            throw new BadRequestException('A least one of the specified maintainer ids does not belong to an existing account')

        const createdMoulinette = this.moulinetteRepository.create({
            project: foundProject,
            maintainers: maintainers as Account[],
            repository: body.repository,
            isOfficial: body.isOfficial
        })

        return this.moulinetteRepository.save(createdMoulinette)
    }

}

export {
    MoulinettesService
}
