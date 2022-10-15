/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Get, Param, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AccountsService } from './accounts.service'
import { GetAccountResDto } from './dto/get-account.res.dto'
import { Account } from './entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { AccountAsOwnerTransformer } from '../common/interceptors/transformers/account-as-owner.transformer'

@Controller('/')
@ApiTags('accounts')
@ApiBearerAuth()
class AccountsController {

    constructor(
        private readonly accountsService: AccountsService
    ) {}

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Get detailed profile information about the current user' })
    @ApiOkResponse({
        type: GetAccountResDto,
        description: 'Get detailed profile information about the current user'
    })
    @ApiUnauthorizedResponse({
        type: ErrorResDto,
        description: 'Unauthorized'
    })
    getCurrentUserProfile(@CurrentUser() user: Account): GetAccountResDto {
        return {
            status: 'success',
            data: user
        }
    }

    @Get('/account/:accountId')
    @UseGuards(OptionalJwtAuthGuard)
    @UseInterceptors(AccountAsOwnerTransformer)
    @ApiOperation({ summary: 'Get profile information about a user' })
    @ApiOkResponse({
        type: GetAccountResDto,
        description: 'Get profile information about a user'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async getUserProfile(@Param('accountId') accountId: string): Promise<GetAccountResDto> {

        const account = await this.accountsService.findAccountById(accountId)

        return {
            status: 'success',
            data: account
        }
    }

}

export {
    AccountsController
}
