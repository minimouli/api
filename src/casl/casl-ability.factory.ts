/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AbilityBuilder, PureAbility } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { $elemMatch, $eq, createQueryTester } from 'sift'
import { Account } from '../accounts/entities/account.entity'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import { Moulinette } from '../moulinettes/entities/moulinette.entity'
import { MoulinetteSource } from '../moulinettes/entities/moulinette-source.entity'
import { Organization } from '../organizations/entities/organization.entity'
import { Project } from '../projects/entities/project.entity'
import { Run } from '../runs/entities/run.entity'
import { AuthToken } from '../tokens/entities/auth-token.entity'
import type { AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'

type Subjects = InferSubjects<
    typeof Account
    | typeof AuthToken
    | typeof Moulinette
    | typeof MoulinetteSource
    | typeof Organization
    | typeof Project
    | typeof Run
>
type AppAbility = PureAbility<[CaslAction, Subjects]>

@Injectable()
class CaslAbilityFactory {

    // eslint-disable-next-line complexity
    createForAccount(account: Account): AppAbility {

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { can, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)
        const permissions = account.permissions

        /* Account */
        can(CaslAction.Read, Account, { id: account.id })

        if (permissions.includes(Permission.ReadAllAccounts))
            can(CaslAction.Read, Account)

        if (permissions.includes(Permission.UpdateOwnAccount))
            can(CaslAction.Update, Account, { id: account.id })

        if (permissions.includes(Permission.UpdateAllAccounts))
            can(CaslAction.Update, Account)

        if (permissions.includes(Permission.DeleteOwnAccount))
            can(CaslAction.Delete, Account, { id: account.id })

        if (permissions.includes(Permission.DeleteAllAccounts))
            can(CaslAction.Delete, Account)

        /* Auth Token */
        if (permissions.includes(Permission.ReadOwnAuthTokens))
            can(CaslAction.Read, AuthToken, { 'account.id': account.id })

        if (permissions.includes(Permission.ReadAllAuthTokens))
            can(CaslAction.Read, AuthToken)

        if (permissions.includes(Permission.DeleteOwnAuthTokens))
            can(CaslAction.Delete, AuthToken, { 'account.id': account.id })

        if (permissions.includes(Permission.DeleteAllAuthTokens))
            can(CaslAction.Delete, AuthToken)

        /* Moulinette */
        if (permissions.includes(Permission.CreateMoulinette))
            can(CaslAction.Create, Moulinette)

        can(CaslAction.Update, Moulinette, {
            maintainers: {
                $elemMatch: { id: account.id }
            }
        })

        if (permissions.includes(Permission.UpdateMoulinette))
            can(CaslAction.Update, Moulinette)

        can(CaslAction.Delete, Moulinette, {
            maintainers: {
                $elemMatch: { id: account.id }
            }
        })

        if (permissions.includes(Permission.DeleteMoulinette))
            can(CaslAction.Delete, Moulinette)

        /* Moulinette Source */
        can(CaslAction.Create, MoulinetteSource, {
            'moulinette.maintainers': {
                $elemMatch: { id: account.id }
            }
        })

        if (permissions.includes(Permission.CreateMoulinetteSource))
            can(CaslAction.Create, MoulinetteSource)

        can(CaslAction.Update, MoulinetteSource, {
            'moulinette.maintainers': {
                $elemMatch: { id: account.id }
            }
        })

        if (permissions.includes(Permission.UpdateMoulinetteSource))
            can(CaslAction.Update, MoulinetteSource)

        can(CaslAction.Delete, MoulinetteSource, {
            'moulinette.maintainers': {
                $elemMatch: { id: account.id }
            }
        })

        if (permissions.includes(Permission.DeleteMoulinetteSource))
            can(CaslAction.Delete, MoulinetteSource)

        /* Organization */
        if (permissions.includes(Permission.CreateOrganization))
            can(CaslAction.Create, Organization)

        if (permissions.includes(Permission.UpdateOrganization))
            can(CaslAction.Update, Organization)

        if (permissions.includes(Permission.DeleteOrganization))
            can(CaslAction.Delete, Organization)

        /* Project */
        if (permissions.includes(Permission.CreateProject))
            can(CaslAction.Create, Project)

        if (permissions.includes(Permission.UpdateProject))
            can(CaslAction.Update, Project)

        if (permissions.includes(Permission.DeleteProject))
            can(CaslAction.Delete, Project)

        /* Run */
        if (permissions.includes(Permission.CreateRun))
            can(CaslAction.Create, Run)

        can(CaslAction.Read, Run, { 'owner.id': account.id })

        if (permissions.includes(Permission.ReadAllRuns))
            can(CaslAction.Read, Run)

        can(CaslAction.Delete, Run, { 'owner.id': account.id })

        if (permissions.includes(Permission.DeleteAllRuns))
            can(CaslAction.Delete, Run)

        return build({
            detectSubjectType: (subject) => subject.constructor as ExtractSubjectType<Subjects>,
            conditionsMatcher: (conditions) => createQueryTester(conditions, {
                operations: { $eq, $elemMatch }
            })
        })
    }

}

export {
    CaslAbilityFactory
}
