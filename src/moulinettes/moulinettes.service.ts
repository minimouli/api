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
import { Moulinette } from './entities/moulinette.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Project } from '../projects/entities/project.entity'
import type { PagingResult } from 'typeorm-cursor-pagination'
import type { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'
import type { GetMoulinettesQueryDto } from './dto/get-moulinettes.query.dto'
import type { UpdateMoulinetteReqDto } from './dto/update-moulinette.req.dto'

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

    async create(body: CreateMoulinetteReqDto, initiator: Account): Promise<Moulinette> {

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

    async findById(id: string): Promise<Moulinette> {

        const moulinette = await this.moulinetteRepository.findOne({
            where: { id },
            relations: ['maintainers', 'project', 'sources'],
            order: {
                sources: {
                    majorVersion: 'DESC',
                    minorVersion: 'DESC',
                    patchVersion: 'DESC'
                }
            }
        })

        if (moulinette === null)
            throw new NotFoundException()

        return moulinette
    }

    async list(query: GetMoulinettesQueryDto): Promise<PagingResult<Moulinette>> {

        const queryBuilder = this.moulinetteRepository.createQueryBuilder('moulinette')
            .leftJoinAndSelect('moulinette.maintainers', 'maintainer')
            .leftJoinAndSelect('moulinette.project', 'project')
            .leftJoinAndSelect('project.organization', 'organization')

        if (query.isOfficial !== undefined)
            queryBuilder.andWhere('moulinette.isOfficial = :isOfficial', { isOfficial: query.isOfficial })

        if (query.projectName !== undefined)
            queryBuilder.andWhere('project.name = :projectName', { projectName: query.projectName })

        if (query.projectCycle !== undefined)
            queryBuilder.andWhere('project.cycle = :projectCycle', { projectCycle: query.projectCycle })

        if (query.organizationName !== undefined)
            queryBuilder.andWhere('organization.name = :organizationName', { organizationName: query.organizationName })

        const paginator = buildPaginator({
            entity: Moulinette,
            paginationKeys: ['id'],
            query: {
                ...query,
                order: 'ASC'
            }
        })

        return paginator.paginate(queryBuilder)
    }

    async update(subject: Moulinette, body: UpdateMoulinetteReqDto, initiator: Account): Promise<Moulinette> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Update, subject))
            throw new ForbiddenException()

        const maintainers = !body.maintainers
            ? subject.maintainers
            : await Promise.all(body.maintainers.map(async (id) => this.accountRepository.findOneBy({ id })))

        // eslint-disable-next-line unicorn/no-null
        if (maintainers.includes(null))
            throw new BadRequestException('A least one of the specified maintainer ids does not belong to an existing account')

        await this.moulinetteRepository.save({
            ...subject,
            ...body,
            maintainers: maintainers as Account[]
        })

        const updatedMoulinette = await this.moulinetteRepository.findOne({
            where: { id: subject.id },
            relations: ['maintainers', 'project']
        })

        if (updatedMoulinette === null)
            throw new NotFoundException()

        return updatedMoulinette
    }

    async updateById(id: string, body: UpdateMoulinetteReqDto, initiator: Account): Promise<Moulinette> {

        const moulinette = await this.moulinetteRepository.findOne({
            where: { id },
            relations: ['maintainers']
        })

        if (moulinette === null)
            throw new NotFoundException()

        return this.update(moulinette, body, initiator)
    }

    async delete(subject: Moulinette, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Delete, subject))
            throw new ForbiddenException()

        await this.moulinetteRepository.remove(subject)
    }

    async deleteById(id: string, initiator: Account): Promise<void> {

        const moulinette = await this.moulinetteRepository.findOne({
            where: { id },
            relations: ['maintainers']
        })

        if (moulinette === null)
            throw new NotFoundException()

        await this.delete(moulinette, initiator)
    }
}

export {
    MoulinettesService
}
