/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface GitHubUserEmailDto {
    email: string
    primary: boolean
}

type GitHubUserEmailsDto = GitHubUserEmailDto[]

export type {
    GitHubUserEmailDto,
    GitHubUserEmailsDto
}
