/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

enum Permission {
    ReadAllAccounts = 'Permission.ReadAllAccounts',
    UpdateOwnAccount = 'Permission.UpdateOwnAccount',
    UpdateAllAccounts = 'Permission.UpdateAllAccounts',
    UpdateAccountPermissions = 'Permission.UpdateAccountPermissions',
    DeleteOwnAccount = 'Permission.DeleteOwnAccount',
    DeleteAllAccounts = 'Permission.DeleteAllAccounts',
    ReadOwnAuthTokens = 'Permission.ReadOwnAuthTokens',
    ReadAllAuthTokens = 'Permission.ReadAllAuthTokens',
    DeleteOwnAuthTokens = 'Permission.DeleteOwnAuthTokens',
    DeleteAllAuthTokens = 'Permission.DeleteAllAuthTokens',
    CreateProject = 'Permission.CreateProject'
}

export {
    Permission
}
