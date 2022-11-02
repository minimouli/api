/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Organization } from './entities/organization.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { CreateOrganizationReqDto } from './dto/create-organization.req.dto'
import type { UpdateOrganizationReqDto } from './dto/update-organization.req.dto'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class OrganizationsService {

    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async createOrganization(body: CreateOrganizationReqDto, initiator: Account): Promise<Organization> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Create, Organization))
            throw new ForbiddenException()

        const createdOrganization = this.organizationRepository.create(body)

        return this.organizationRepository.save(createdOrganization)
    }

    async updateOrganization(subject: Organization, body: UpdateOrganizationReqDto, initiator: Account): Promise<Organization> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Update, subject))
            throw new ForbiddenException()

        return this.organizationRepository.save({
            ...subject,
            ...body
        })
    }

    async updateOrganizationById(subjectId: string, body: UpdateOrganizationReqDto, initiator: Account): Promise<Organization> {

        const organization = await this.organizationRepository.findOneBy({ id: subjectId })

        if (organization === null)
            throw new NotFoundException()

        return this.updateOrganization(organization, body, initiator)
    }

    async deleteOrganization(subject: Organization, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Delete, subject))
            throw new ForbiddenException()

        await this.organizationRepository.remove(subject)
    }

    async deleteOrganizationById(subjectId: string, initiator: Account): Promise<void> {

        const subject = await this.organizationRepository.findOneBy({ id: subjectId })

        if (subject === null)
            throw new NotFoundException()

        await this.deleteOrganization(subject, initiator)
    }

}

export {
    OrganizationsService
}
