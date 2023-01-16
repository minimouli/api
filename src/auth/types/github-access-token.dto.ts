/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface GitHubAccessTokenSuccessDto {
    error: undefined
    access_token: string
    token_type: string
    scope: string
}

interface GitHubAccessTokenFailureDto {
    error: string
}

type GitHubAccessTokenDto = GitHubAccessTokenSuccessDto | GitHubAccessTokenFailureDto

export type {
    GitHubAccessTokenDto
}
