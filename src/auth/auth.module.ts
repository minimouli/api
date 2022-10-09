/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GithubCredentials } from './entities/github-credentials.entity'
import { GithubApiService } from './services/github-api.service'
import { GithubCredentialsService } from './services/github-credentials.service'
import { AccountsModule } from '../accounts/accounts.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([GithubCredentials]),
        HttpModule,
        AccountsModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GithubApiService,
        GithubCredentialsService
    ]
})
class AuthModule {}

export {
    AuthModule
}
