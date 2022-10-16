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
import { getRandomString } from '../common/helpers/random.helper'
import { LOWER_CASE_ALPHA, NUMERIC } from '../common/helpers/string.helper'
import type { UpdateAccountReqDto } from './dto/update-account.req.dto'

@Injectable()
class AccountsService {

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async create(nickname: string, email: string, permissions = DefaultPermissions): Promise<Account> {

        const account = this.accountRepository.create({
            username: getRandomString(16, `${LOWER_CASE_ALPHA}${NUMERIC}`),
            nickname,
            email,
            permissions
        })

        return this.accountRepository.save(account)
    }

    async findAccountById(id: string): Promise<Account> {

        const account = await this.accountRepository.findOneBy({ id })

        if (account === null)
            throw new NotFoundException()

        return account
    }

    async updateAccount(subject: Account, body: Partial<UpdateAccountReqDto>, initiator: Account): Promise<Account> {

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

        const updatedAccount = await this.accountRepository.findOneBy({ id: subject.id })

        if (updatedAccount === null)
            throw new NotFoundException()

        return updatedAccount
    }

    async updateAccountById(subjectId: string, body: Partial<UpdateAccountReqDto>, initiator: Account): Promise<Account> {

        const account = await this.accountRepository.findOneBy({ id: subjectId })

        if (!account)
            throw new NotFoundException()

        return this.updateAccount(account, body, initiator)
    }

    async deleteAccount(subject: Account, initiator: Account): Promise<void> {

        const ability = this.caslAbilityFactory.createForAccount(initiator)

        if (!ability.can(CaslAction.Delete, subject))
            throw new ForbiddenException()

        await this.accountRepository.remove(subject)
    }

    async deleteAccountById(subjectId: string, initiator: Account): Promise<void> {

        const subject = await this.accountRepository.findOneBy({ id: subjectId })

        if (subject === null)
            throw new NotFoundException()

        await this.deleteAccount(subject, initiator)
    }

    async isTheUsernameAvailable(username: string): Promise<boolean> {
        const account = await this.accountRepository.findOneBy({ username })
        return account === null
    }

}

export {
    AccountsService
}
