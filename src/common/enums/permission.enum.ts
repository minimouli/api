/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

enum Permission {
    ReadAllAccounts = 'Permission.ReadAllAccounts',
    ReadOwnAuthTokens = 'Permission.ReadOwnAuthTokens',
    ReadAllAuthTokens = 'Permission.ReadAllAuthTokens',
    DeleteOwnAuthTokens = 'Permission.DeleteOwnAuthTokens',
    DeleteAllAuthTokens = 'Permission.DeleteAllAuthTokens'
}

export {
    Permission
}
