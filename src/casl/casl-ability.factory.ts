/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AbilityBuilder, PureAbility } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { $eq, createQueryTester } from 'sift'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import { AuthToken } from '../tokens/entities/auth-token.entity'
import type { AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import type { Account } from '../accounts/entities/account.entity'

type Subjects = InferSubjects<typeof Account | typeof AuthToken>
type AppAbility = PureAbility<[CaslAction, Subjects]>

@Injectable()
class CaslAbilityFactory {

    createForAccount(account: Account): AppAbility {

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { can, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)
        const permissions = account.permissions

        if (permissions.includes(Permission.ReadAuthToken))
            can(CaslAction.Read, AuthToken)

        if (permissions.includes(Permission.ReadOwnAuthToken))
            can(CaslAction.Read, AuthToken, { 'account.id': account.id })

        if (permissions.includes(Permission.DeleteAuthToken))
            can(CaslAction.Delete, AuthToken)

        if (permissions.includes(Permission.DeleteOwnAuthToken))
            can(CaslAction.Delete, AuthToken, { 'account.id': account.id })

        return build({
            detectSubjectType: (subject) => subject.constructor as ExtractSubjectType<Subjects>,
            conditionsMatcher: (conditions) => createQueryTester(conditions, {
                operations: { $eq }
            })
        })
    }

}

export {
    CaslAbilityFactory
}
