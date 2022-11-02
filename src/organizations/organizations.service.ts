/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Organization } from './entities/organization.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { CreateOrganizationReqDto } from './dto/create-organization.req.dto'
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

}

export {
    OrganizationsService
}
