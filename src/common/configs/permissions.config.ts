/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Permission } from '../enums/permission.enum'

const AdminPermissions = [
    Permission.ReadAllAccounts,
    Permission.UpdateAllAccounts,
    Permission.UpdateAccountPermissions,
    Permission.DeleteAllAccounts,
    Permission.ReadAllAuthTokens,
    Permission.DeleteAllAuthTokens,
    Permission.CreateMoulinette,
    Permission.UpdateMoulinette,
    Permission.DeleteMoulinette,
    Permission.CreateMoulinetteSource,
    Permission.UpdateMoulinetteSource,
    Permission.DeleteMoulinetteSource,
    Permission.CreateOrganization,
    Permission.UpdateOrganization,
    Permission.DeleteOrganization,
    Permission.CreateProject,
    Permission.UpdateProject,
    Permission.DeleteProject,
    Permission.CreateRun,
    Permission.ReadAllRuns
]

const DefaultPermissions = [
    Permission.UpdateOwnAccount,
    Permission.DeleteOwnAccount,
    Permission.ReadOwnAuthTokens,
    Permission.DeleteOwnAuthTokens,
    Permission.CreateRun
]

export {
    AdminPermissions,
    DefaultPermissions
}
