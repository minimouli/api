/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Delete, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { MoulinettesService } from './moulinettes.service'
import { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'
import { GetMoulinetteResDto } from './dto/get-moulinette.res.dto'
import { UpdateMoulinetteReqDto } from './dto/update-moulinette.req.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'

@Controller('/')
@ApiTags('moulinettes')
@ApiBearerAuth()
class MoulinettesController {

    constructor(
        private readonly moulinettesService: MoulinettesService
    ) {}

    @Post('/moulinette')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new moulinette' })
    @ApiCreatedResponse({
        type: GetMoulinetteResDto,
        description: 'Create a new moulinette'
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
    async createMoulinette(@CurrentUser() currentUser: Account, @Body() body: CreateMoulinetteReqDto): Promise<GetMoulinetteResDto> {

        const moulinette = await this.moulinettesService.createMoulinette(body, currentUser)

        return {
            status: 'success',
            data: moulinette
        }
    }

    @Patch('/moulinette/:moulinetteId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update information about a moulinette' })
    @ApiOkResponse({
        type: GetMoulinetteResDto,
        description: 'Update information about a moulinette'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Bad request'
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
    async updateMoulinetteInformation(
        @CurrentUser() currentUser: Account,
        @Param('moulinetteId') moulinetteId: string,
        @Body() body: UpdateMoulinetteReqDto
    ): Promise<GetMoulinetteResDto> {

        const updatedMoulinette = await this.moulinettesService.updateMoulinetteById(moulinetteId, body, currentUser)

        return {
            status: 'success',
            data: updatedMoulinette
        }
    }

    @Delete('/moulinette/:moulinetteId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a moulinette' })
    @ApiNoContentResponse({
        description: 'Delete a moulinette'
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
    async deleteMoulinette(@CurrentUser() currentUser: Account, @Param('moulinetteId') moulinetteId: string): Promise<void> {
        await this.moulinettesService.deleteMoulinetteById(moulinetteId, currentUser)
    }

}

export {
    MoulinettesController
}
