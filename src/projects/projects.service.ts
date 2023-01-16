/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { Project } from './entities/project.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Organization } from '../organizations/entities/organization.entity'
import type { PagingResult } from 'typeorm-cursor-pagination'
import type { CreateProjectReqDto } from './dto/create-project.req.dto'
import type { GetProjectsQueryDto } from './dto/get-projects.query.dto'
import type { UpdateProjectReqDto } from './dto/update-project.req.dto'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class ProjectsService {

    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async create(body: CreateProjectReqDto, initiator: Account): Promise<Project> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Create, Project))
            throw new ForbiddenException()

        const organization = await this.organizationRepository.findOneBy({
            id: body.organization
        })

        if (organization === null)
            throw new BadRequestException('The specified organization id does not belong to an existing organization')

        const createdProject = this.projectRepository.create({
            ...body,
            organization
        })

        return this.projectRepository.save(createdProject)
    }

    async findById(id: string): Promise<Project> {

        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['organization']
        })

        if (project === null)
            throw new NotFoundException()

        return project
    }

    async list(query: GetProjectsQueryDto): Promise<PagingResult<Project>> {

        const queryBuilder = this.projectRepository.createQueryBuilder('project')
            .leftJoinAndSelect('project.organization', 'organization')

        const paginator = buildPaginator({
            entity: Project,
            paginationKeys: ['id'],
            query: {
                ...query,
                order: 'ASC'
            }
        })

        return paginator.paginate(queryBuilder)
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
