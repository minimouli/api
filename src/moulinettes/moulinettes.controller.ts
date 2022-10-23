/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { MoulinettesService } from './moulinettes.service'
import { CreateMoulinetteReqDto } from './dto/create-moulinette.req.dto'
import { GetMoulinetteResDto } from './dto/get-moulinette.res.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { CurrentUser } from '../common/decorators/current-user.decorator'

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

}

export {
    MoulinettesController
}
