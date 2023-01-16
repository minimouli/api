/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { Organization } from './entities/organization.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { PagingResult } from 'typeorm-cursor-pagination'
import type { CreateOrganizationReqDto } from './dto/create-organization.req.dto'
import type { GetOrganizationsQueryDto } from './dto/get-organizations.query.dto'
import type { UpdateOrganizationReqDto } from './dto/update-organization.req.dto'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class OrganizationsService {

    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async create(body: CreateOrganizationReqDto, initiator: Account): Promise<Organization> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Create, Organization))
            throw new ForbiddenException()

        const createdOrganization = this.organizationRepository.create(body)

        return this.organizationRepository.save(createdOrganization)
    }

    async findById(id: string): Promise<Organization> {

        const organization = await this.organizationRepository.findOneBy({ id })

        if (organization === null)
            throw new NotFoundException()

        return organization
    }

    async list(query: GetOrganizationsQueryDto): Promise<PagingResult<Organization>> {

        const queryBuilder = this.organizationRepository.createQueryBuilder('organization')

        const paginator = buildPaginator({
            entity: Organization,
            paginationKeys: ['id'],
            query: {
                ...query,
                order: 'ASC'
            }
        })

        return paginator.paginate(queryBuilder)
    }

    async update(subject: Organization, body: UpdateOrganizationReqDto, initiator: Account): Promise<Organization> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Update, subject))
            throw new ForbiddenException()

        return this.organizationRepository.save({
            ...subject,
            ...body
        })
    }

    async updateById(id: string, body: UpdateOrganizationReqDto, initiator: Account): Promise<Organization> {

        const organization = await this.organizationRepository.findOneBy({ id })

        if (organization === null)
            throw new NotFoundException()

        return this.update(organization, body, initiator)
    }

    async delete(subject: Organization, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Delete, subject))
            throw new ForbiddenException()

        await this.organizationRepository.remove(subject)
    }

    async deleteById(id: string, initiator: Account): Promise<void> {

        const subject = await this.organizationRepository.findOneBy({ id })

        if (subject === null)
            throw new NotFoundException()

        await this.delete(subject, initiator)
    }

}

export {
    OrganizationsService
}
