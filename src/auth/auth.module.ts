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
import { GitHubCredentials } from './entities/github-credentials.entity'
import { GitHubApiService } from './services/github-api.service'
import { GitHubCredentialsService } from './services/github-credentials.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AccountsModule } from '../accounts/accounts.module'
import { Account } from '../accounts/entities/account.entity'
import { TokensModule } from '../tokens/tokens.module'
import { AuthToken } from '../tokens/entities/auth-token.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, AuthToken, GitHubCredentials]),
        HttpModule,
        AccountsModule,
        TokensModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GitHubApiService,
        GitHubCredentialsService,
        JwtStrategy
    ]
})
class AuthModule {}

export {
    AuthModule
}
