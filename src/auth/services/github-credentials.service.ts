/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GitHubCredentials } from '../entities/github-credentials.entity'
import type { Account } from '../../accounts/entities/account.entity'

class GitHubCredentialsService {

    constructor(
        @InjectRepository(GitHubCredentials)
        private readonly githubCredentialsRepository: Repository<GitHubCredentials>
    ) {}

    async create(githubId: number, account: Account): Promise<GitHubCredentials> {

        const githubCredentials = this.githubCredentialsRepository.create({
            githubId,
            account
        })

        return this.githubCredentialsRepository.save(githubCredentials)
    }

}

export {
    GitHubCredentialsService
}
