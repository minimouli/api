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
    Permission.DeleteAllAuthTokens
]

const DefaultPermissions = [
    Permission.UpdateOwnAccount,
    Permission.DeleteOwnAccount,
    Permission.ReadOwnAuthTokens,
    Permission.DeleteOwnAuthTokens
]

export {
    AdminPermissions,
    DefaultPermissions
}
