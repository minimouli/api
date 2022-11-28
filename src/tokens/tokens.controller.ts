/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Delete, Get, HttpCode, Param, Query, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { TokensService } from './tokens.service'
import { GetAuthTokensQueryDto } from './dto/get-auth-tokens.query.dto'
import { GetAuthTokensResDto } from './dto/get-auth-tokens.res.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Account } from '../accounts/entities/account.entity'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'

@Controller('/')
@ApiTags('tokens')
@ApiBearerAuth()
class TokensController {

    constructor(
        private readonly tokensService: TokensService
    ) {}

    @Get('/me/tokens')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get auth tokens owned by the current user' })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false
    })
    @ApiQuery({
        name: 'beforeCursor',
        type: String,
        required: false
    })
    @ApiQuery({
        name: 'afterCursor',
        type: String,
        required: false
    })
    @ApiOkResponse({
        type: GetAuthTokensResDto,
        description: 'Get auth tokens owned by the current user'
    })
    @ApiUnauthorizedResponse({
        type: ErrorResDto,
        description: 'Unauthorized'
    })
    @ApiForbiddenResponse({
        type: ErrorResDto,
        description: 'Forbidden'
    })
    async listCurrentUserAuthTokens(
        @CurrentUser() currentUser: Account,
        @Query() query: GetAuthTokensQueryDto
    ): Promise<GetAuthTokensResDto> {

        const { cursor, data } = await this.tokensService.listAuthTokensFromAccountId(currentUser.id, query, currentUser)

        return {
            status: 'success',
            data: {
                object: 'list',
                items: data,
                beforeCursor: cursor.beforeCursor,
                afterCursor: cursor.afterCursor
            }
        }
    }

    @Get('/account/:ownerId/tokens')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get auth tokens owned by a given user' })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false
    })
    @ApiQuery({
        name: 'beforeCursor',
        type: String,
        required: false
    })
    @ApiQuery({
        name: 'afterCursor',
        type: String,
        required: false
    })
    @ApiOkResponse({
        type: GetAuthTokensResDto,
        description: 'Get auth tokens owned by a given user'
    })
    @ApiUnauthorizedResponse({
        type: ErrorResDto,
        description: 'Unauthorized'
    })
    @ApiForbiddenResponse({
        type: ErrorResDto,
        description: 'Forbidden'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async listAuthTokens(
        @CurrentUser() currentUser: Account,
        @Query() query: GetAuthTokensQueryDto,
        @Param('ownerId') ownerId: string
    ): Promise<GetAuthTokensResDto> {

        const { cursor, data } = await this.tokensService.listAuthTokensFromAccountId(ownerId, query, currentUser)

        return {
            status: 'success',
            data: {
                object: 'list',
                items: data,
                beforeCursor: cursor.beforeCursor,
                afterCursor: cursor.afterCursor
            }
        }
    }

    @Delete('/token/:authTokenId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete an auth token by id' })
    @ApiNoContentResponse({
        description: 'Delete an auth token by id'
    })
    @ApiUnauthorizedResponse({
        type: ErrorResDto,
        description: 'Unauthorized'
    })
    @ApiForbiddenResponse({
        type: ErrorResDto,
        description: 'Forbidden'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async deleteAuthTokenById(@CurrentUser() currentUser: Account, @Param('authTokenId') authTokenId: string): Promise<void> {
        await this.tokensService.deleteAuthTokenById(authTokenId, currentUser)
    }

}

export {
    TokensController
}
