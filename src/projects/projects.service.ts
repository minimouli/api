/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { getCurrentCycle } from './helpers/cycle.helper'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class ProjectsService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async createProject(name: string, organization: string, initiator: Account): Promise<Project> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Create, Project))
            throw new ForbiddenException()

        const cycle = getCurrentCycle()

        const foundProject = await this.projectRepository.findOneBy({
            name: name.toLowerCase(),
            organization: organization.toLowerCase(),
            cycle
        })

        if (foundProject !== null)
            return foundProject

        const createdProject = this.projectRepository.create({
            name,
            organization,
            cycle
        })

        return this.projectRepository.save(createdProject)
    }

}

export {
    ProjectsService
}
