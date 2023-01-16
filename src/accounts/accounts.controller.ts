/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Put,
    SerializeOptions,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AccountsService } from './accounts.service'
import { GetAccountResDto } from './dto/get-account.res.dto'
import { UpdateAccountReqDto } from './dto/update-account.req.dto'
import { Account } from './entities/account.entity'
import { UpdateAccountPermissionsReqDto } from './dto/update-account-permissions.req.dto'
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

        const account = await this.accountsService.findById(accountId)

        return {
            status: 'success',
            data: account
        }
    }

    @Patch('/me')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({ groups: ['owner'] })
    @ApiOperation({ summary: 'Update the profile information about the current user' })
    @ApiOkResponse({
        type: GetAccountResDto,
        description: 'Update the profile information about the current user'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Bad Request'
    })
    @ApiUnauthorizedResponse({
        type: ErrorResDto,
        description: 'Unauthorized'
    })
    @ApiForbiddenResponse({
        type: ErrorResDto,
        description: 'Forbidden'
    })
    async updateCurrentUserProfile(@CurrentUser() currentUser: Account, @Body() body: UpdateAccountReqDto): Promise<GetAccountResDto> {

        const updatedAccount = await this.accountsService.update(currentUser, body, currentUser)

        return {
            status: 'success',
            data: updatedAccount
        }
    }

    @Patch('/account/:accountId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AccountAsOwnerTransformer)
    @ApiOperation({ summary: 'Update the profile information about a user' })
    @ApiOkResponse({
        type: GetAccountResDto,
        description: 'Update the profile information about a user'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Bad Request'
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
    async updateUserProfile(
        @CurrentUser() currentUser: Account,
        @Param('accountId') accountId: string,
        @Body() body: UpdateAccountReqDto
    ): Promise<GetAccountResDto> {

        const updatedAccount = await this.accountsService.updateById(accountId, body, currentUser)

        return {
            status: 'success',
            data: updatedAccount
        }
    }

    @Put('/account/:accountId/permissions')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AccountAsOwnerTransformer)
    @ApiOperation({ summary: 'Update permissions about a user' })
    @ApiOkResponse({
        type: GetAccountResDto,
        description: 'Update permissions about a user'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Bad Request'
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
    async updateUserPermissions(
        @CurrentUser() currentUser: Account,
        @Param('accountId') accountId: string,
        @Body() body: UpdateAccountPermissionsReqDto
    ): Promise<GetAccountResDto> {

        const account = await this.accountsService.updatePermissionsByAccountId(accountId, body.permissions, currentUser)

        return {
            status: 'success',
            data: account
        }
    }

    @Delete('/me')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete the account of the current user' })
    @ApiNoContentResponse({
        description: 'Delete the account of the current user'
    })
    @ApiUnauthorizedResponse({
        type: ErrorResDto,
        description: 'Unauthorized'
    })
    @ApiForbiddenResponse({
        type: ErrorResDto,
        description: 'Forbidden'
    })
    async deleteCurrentUserAccount(@CurrentUser() currentUser: Account): Promise<void> {
        await this.accountsService.delete(currentUser, currentUser)
    }

    @Delete('/account/:accountId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete the account of a user' })
    @ApiNoContentResponse({
        description: 'Delete the account of a user'
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
    async deleteUserAccount(@CurrentUser() currentUser: Account, @Param('accountId') accountId: string): Promise<void> {
        await this.accountsService.deleteById(accountId, currentUser)
    }

}

export {
    AccountsController
}
