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
    Post,
    Query,
    UseGuards
} from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation, ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationReqDto } from './dto/create-organization.req.dto'
import { GetOrganizationResDto } from './dto/get-organization.res.dto'
import { GetOrganizationsResDto } from './dto/get-organizations.res.dto'
import { GetOrganizationsQueryDto } from './dto/get-organizations.query.dto'
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

        const organization = await this.organizationService.create(body, currentUser)

        return {
            status: 'success',
            data: organization
        }
    }

    @Get('/organization/:organizationId')
    @ApiOperation({ summary: 'Get information about an organization' })
    @ApiOkResponse({
        type: GetOrganizationResDto,
        description: 'Get information about an organization'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async getOrganizationById(@Param('organizationId') organizationId: string): Promise<GetOrganizationResDto> {

        const organization = await this.organizationService.findById(organizationId)

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

        const updatedOrganization = await this.organizationService.updateById(organizationId, body, currentUser)

        return {
            status: 'success',
            data: updatedOrganization
        }
    }

    @Delete('/organization/:organizationId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete an organization' })
    @ApiNoContentResponse({
        description: 'Delete an organization'
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
    async deleteOrganization(@CurrentUser() currentUser: Account, @Param('organizationId') organizationId: string): Promise<void> {
        await this.organizationService.deleteById(organizationId, currentUser)
    }

    @Get('/organizations')
    @ApiOperation({ summary: 'List organizations' })
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
        type: GetOrganizationsResDto,
        description: 'List organizations'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Bad Request'
    })
    async listOrganizations(@Query() query: GetOrganizationsQueryDto): Promise<GetOrganizationsResDto> {

        const { cursor, data } = await this.organizationService.list(query)

        return {
            status: 'success',
            data: {
                items: data,
                ...cursor
            }
        }
    }

}

export {
    OrganizationsController
}
