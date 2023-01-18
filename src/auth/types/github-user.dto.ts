/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface GitHubUserDto {
    id: number
    login: string
    name: string | null
    avatar_url: string
}

export type {
    GitHubUserDto
}
