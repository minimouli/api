/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'
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
import { RunsService } from './runs.service'
import { CreateRunReqDto } from './dto/create-run.req.dto'
import { GetRunResDto } from './dto/get-run.res.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { RunAsOwnerTransformer } from '../common/interceptors/transformers/run-as-owner.transformer'

@Controller('/')
@ApiTags('runs')
@ApiBearerAuth()
class RunsController {

    constructor(
        private readonly runsService: RunsService
    ) {}

    @Post('/run')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new run' })
    @ApiCreatedResponse({
        type: GetRunResDto,
        description: 'Create a new run'
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
    async createRun(@CurrentUser() currentUser: Account, @Body() body: CreateRunReqDto): Promise<GetRunResDto> {

        const run = await this.runsService.create(body, currentUser)

        return {
            status: 'success',
            data: run
        }
    }

    @Get('/run/:runId')
    @UseGuards(OptionalJwtAuthGuard)
    @UseInterceptors(RunAsOwnerTransformer)
    @ApiOperation({ summary: 'Get information about a run' })
    @ApiOkResponse({
        type: GetRunResDto,
        description: 'Get information about a run'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async getRun(@Param('runId') runId: string): Promise<GetRunResDto> {

        const run = await this.runsService.findById(runId)

        return {
            status: 'success',
            data: run
        }
    }

}

export {
    RunsController
}
