/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account } from './entities/account.entity'
import { validateNickname, validateUsername } from './helpers/name.helper'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { DefaultPermissions } from '../common/configs/permissions.config'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import type { UpdateAccountReqDto } from './dto/update-account.req.dto'

@Injectable()
class AccountsService {

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async create(nickname: string, username: string, email: string, permissions = DefaultPermissions): Promise<Account> {

        const account = this.accountRepository.create({
            username,
            nickname,
            email,
            permissions
        })

        return this.accountRepository.save(account)
    }

    async findById(id: string): Promise<Account> {

        const account = await this.accountRepository.findOneBy({ id })

        if (account === null)
            throw new NotFoundException()

        return account
    }

    async update(subject: Account, body: UpdateAccountReqDto, initiator: Account): Promise<Account> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Update, subject))
            throw new ForbiddenException()

        let nameErrors: string[] = []

        if (body.nickname !== undefined)
            nameErrors = [...nameErrors, ...validateNickname(body.nickname)]

        if (body.username !== undefined)
            nameErrors = [...nameErrors, ...validateUsername(body.username)]

        if (nameErrors.length > 0)
            throw new BadRequestException(nameErrors)

        if (body.username !== undefined) {

            const isTheUsernameAvailable = await this.isTheUsernameAvailable(body.username)

            if (!isTheUsernameAvailable)
                throw new BadRequestException('The username is already taken by another user')
        }

        await this.accountRepository.save({
            ...subject,
            ...body
        })

        return this.findById(subject.id)
    }

    async updateById(id: string, body: UpdateAccountReqDto, initiator: Account): Promise<Account> {

        const account = await this.accountRepository.findOneBy({ id })

        if (account === null)
            throw new NotFoundException()

        return this.update(account, body, initiator)
    }

    async updatePermissions(subject: Account, permissions: Permission[], initiator: Account): Promise<Account> {

        if (!initiator.permissions.includes(Permission.UpdateAccountPermissions))
            throw new ForbiddenException()

        return this.accountRepository.save({
            ...subject,
            permissions
        })
    }

    async updatePermissionsByAccountId(id: string, permissions: Permission[], initiator: Account): Promise<Account> {

        const account = await this.accountRepository.findOneBy({ id })

        if (account === null)
            throw new NotFoundException()

        return this.updatePermissions(account, permissions, initiator)
    }

    async delete(subject: Account, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Delete, subject))
            throw new ForbiddenException()

        await this.accountRepository.remove(subject)
    }

    async deleteById(id: string, initiator: Account): Promise<void> {

        const subject = await this.accountRepository.findOneBy({ id })

        if (subject === null)
            throw new NotFoundException()

        await this.delete(subject, initiator)
    }

    async isTheUsernameAvailable(username: string): Promise<boolean> {
        const account = await this.accountRepository.findOneBy({ username })
        return account === null
    }

}

export {
    AccountsService
}
