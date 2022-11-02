/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationReqDto } from './dto/create-organization.req.dto'
import { GetOrganizationResDto } from './dto/get-organization.res.dto'
import { UpdateOrganizationReqDto } from './dto/update-organization.req.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'

@Controller('/')
@ApiTags('organizations')
@ApiBearerAuth()
class OrganizationsController {

    constructor(
        private readonly organizationService: OrganizationsService
    ) {}

    @Post('/organization')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new organization' })
    @ApiCreatedResponse({
        type: GetOrganizationResDto,
        description: 'Create a new organization'
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
    async createOrganization(@CurrentUser() currentUser: Account, @Body() body: CreateOrganizationReqDto): Promise<GetOrganizationResDto> {

        const organization = await this.organizationService.createOrganization(body, currentUser)

        return {
            status: 'success',
            data: organization
        }
    }

    @Patch('/organization/:organizationId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update information about an organization' })
    @ApiOkResponse({
        type: GetOrganizationResDto,
        description: 'Update information about an organization'
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
    async updateOrganization(
        @CurrentUser() currentUser: Account,
        @Param('organizationId') organizationId: string,
        @Body() body: UpdateOrganizationReqDto
    ): Promise<GetOrganizationResDto> {

        const updatedOrganization = await this.organizationService.updateOrganizationById(organizationId, body, currentUser)

        return {
            status: 'success',
            data: updatedOrganization
        }
    }

}

export {
    OrganizationsController
}
