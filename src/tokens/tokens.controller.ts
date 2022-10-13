/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Get, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
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
    async getCurrentUserAuthTokens(@CurrentUser() user: Account): Promise<GetAuthTokensResDto> {

        const authTokens = await this.tokensService.getAllAuthTokensOf(user.id, user)

        return {
            status: 'success',
            data: authTokens
        }
    }

}

export {
    TokensController
}
