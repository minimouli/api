/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { TokensService } from './tokens.service'
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
    async getCurrentUserAuthTokens(@CurrentUser() currentUser: Account): Promise<GetAuthTokensResDto> {

        const authTokens = await this.tokensService.getAllAuthTokensFromAccountId(currentUser.id, currentUser)

        return {
            status: 'success',
            data: authTokens
        }
    }

    @Get('/account/:ownerId/tokens')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get auth tokens owned by a given user' })
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
    async getAuthTokens(@CurrentUser() currentUser: Account, @Param('ownerId') ownerId: string): Promise<GetAuthTokensResDto> {

        const authTokens = await this.tokensService.getAllAuthTokensFromAccountId(ownerId, currentUser)

        return {
            status: 'success',
            data: authTokens
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
    async deleteAuthToken(@CurrentUser() user: Account, @Param('authTokenId') authTokenId: string): Promise<void> {
        await this.tokensService.deleteAuthToken(authTokenId, user)
    }

}

export {
    TokensController
}
