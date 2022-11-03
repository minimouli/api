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
    ParseIntPipe,
    Patch,
    Post,
    Put,
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
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { MoulinettesService } from './moulinettes.service'
import { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'
import { GetMoulinetteResDto } from './dto/get-moulinette.res.dto'
import { GetMoulinetteSourceResDto } from './dto/get-moulinette-source.res.dto'
import { PutMoulinetteSourceReqDto } from './dto/put-moulinette-source.req.dto'
import { UpdateMoulinetteReqDto } from './dto/update-moulinette.req.dto'
import { MoulinetteSourcesService } from './services/moulinette-sources.service'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'

@Controller('/')
@ApiTags('moulinettes')
@ApiBearerAuth()
class MoulinettesController {

    constructor(
        private readonly moulinettesService: MoulinettesService,
        private readonly moulinetteSourceService: MoulinetteSourcesService
    ) {}

    @Get('/moulinette/:moulinetteId')
    @ApiOperation({ summary: 'Get information about a moulinette' })
    @ApiOkResponse({
        type: GetMoulinetteResDto,
        description: 'Get information about a moulinette'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async getMoulinette(@Param('moulinetteId') moulinetteId: string): Promise<GetMoulinetteResDto> {

        const moulinette = await this.moulinettesService.findById(moulinetteId)

        return {
            status: 'success',
            data: moulinette
        }
    }

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

        const moulinette = await this.moulinettesService.create(body, currentUser)

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

        const updatedMoulinette = await this.moulinettesService.updateById(moulinetteId, body, currentUser)

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
        await this.moulinettesService.deleteById(moulinetteId, currentUser)
    }

    @Put('/moulinette/:moulinetteId/:major.:minor.:patch')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Put a moulinette source' })
    @ApiOkResponse({
        type: GetMoulinetteSourceResDto,
        description: 'Put a moulinette source'
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
    async putMoulinetteSource(
        @CurrentUser() currentUser: Account,
        @Param('moulinetteId') moulinetteId: string,
        @Param('major', ParseIntPipe) majorVersion: number,
        @Param('minor', ParseIntPipe) minorVersion: number,
        @Param('patch', ParseIntPipe) patchVersion: number,
        @Body() body: PutMoulinetteSourceReqDto
    ): Promise<GetMoulinetteSourceResDto> {

        const moulinetteSource = await this.moulinetteSourceService.put(
            moulinetteId,
            [majorVersion, minorVersion, patchVersion],
            body,
            currentUser
        )

        return {
            status: 'success',
            data: moulinetteSource
        }
    }

    @Delete('/moulinette/:moulinetteId/:major.:minor.:patch')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a moulinette source' })
    @ApiNoContentResponse({
        description: 'Delete a moulinette source'
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
    async deleteMoulinetteSource(
        @CurrentUser() currentUser: Account,
        @Param('moulinetteId') moulinetteId: string,
        @Param('major', ParseIntPipe) majorVersion: number,
        @Param('minor', ParseIntPipe) minorVersion: number,
        @Param('patch', ParseIntPipe) patchVersion: number
    ) {
        await this.moulinetteSourceService.deleteByVersion(
            moulinetteId,
            [majorVersion, minorVersion, patchVersion],
            currentUser
        )
    }

}

export {
    MoulinettesController
}
