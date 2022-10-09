/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GithubCredentials } from '../entities/github-credentials.entity'
import type { Account } from '../../accounts/entities/account.entity'

class GithubCredentialsService {

    constructor(
        @InjectRepository(GithubCredentials)
        private readonly githubCredentialsRepository: Repository<GithubCredentials>
    ) {}

    async create(githubId: number, account: Account): Promise<GithubCredentials> {

        const githubCredentials = this.githubCredentialsRepository.create({
            githubId,
            account
        })

        return this.githubCredentialsRepository.save(githubCredentials)
    }

}

export {
    GithubCredentialsService
}
