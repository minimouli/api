/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { getCurrentCycle } from './helpers/cycle.helper'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { UpdateProjectReqDto } from './dto/update-project.req.dto'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class ProjectsService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async create(name: string, organization: string, initiator: Account): Promise<Project> {

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

    async findById(id: string): Promise<Project> {

        const project = await this.projectRepository.findOneBy({ id })

        if (project === null)
            throw new NotFoundException()

        return project
    }

    async update(subject: Project, body: Partial<UpdateProjectReqDto>, initiator: Account): Promise<Project> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Update, subject))
            throw new ForbiddenException()

        await this.projectRepository.save({
            ...subject,
            ...body
        })

        const updatedProject = await this.projectRepository.findOneBy({ id: subject.id })

        if (updatedProject === null)
            throw new NotFoundException()

        return updatedProject
    }

    async updateById(id: string, body: UpdateProjectReqDto, initiator: Account): Promise<Project> {

        const project = await this.projectRepository.findOneBy({ id })

        if (project === null)
            throw new NotFoundException()

        return this.update(project, body, initiator)
    }

    async delete(subject: Project, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Delete, subject))
            throw new ForbiddenException()

        await this.projectRepository.remove(subject)
    }

    async deleteById(id: string, initiator: Account): Promise<void> {

        const subject = await this.projectRepository.findOneBy({ id })

        if (subject === null)
            throw new NotFoundException()

        await this.delete(subject, initiator)
    }

}

export {
    ProjectsService
}
