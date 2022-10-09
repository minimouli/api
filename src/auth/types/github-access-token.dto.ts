/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface GithubAccessTokenSuccessDto {
    error: undefined
    access_token: string
    token_type: string
    scope: string
}

interface GithubAccessTokenFailureDto {
    error: string
}

type GithubAccessTokenDto = GithubAccessTokenSuccessDto | GithubAccessTokenFailureDto

export type {
    GithubAccessTokenDto
}
