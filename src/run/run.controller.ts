/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import RunService from './run.service'
import CreateRunReqDto from './dto/create-run.req.dto'
import CreateRunResDto from './dto/create-run.res.dto'
import ShowRunResDto from './dto/show-run.res.dto'
import Run from './schemas/run.schema'
import JwtGuard from '../auth/guards/jwt-auth.guard'

@Controller('/run')
@ApiTags('run')
@ApiBearerAuth()
class RunController {

    constructor(
        private readonly runService: RunService
    ) {}

    @Get('/:id')
    @ApiNotFoundResponse({ description: 'No run found.' })
    async show(@Param('id') id: string): Promise<ShowRunResDto> {

        return this.runService.findOneById(id).then((run: Run | null) => {

            if (!run)
                throw new NotFoundException('The specified id does not correspond to a run.')

            return {
                status: 'success',
                data: {
                    uuid: run.uuid,
                    id: run.id,
                    owner_uuid: run.owner_uuid,
                    project: run.project,
                    suites: run.suites,
                    creation_date: run.creation_date,
                    duration: run.duration
                }
            }
        })
    }

    @Post('/')
    @UseGuards(JwtGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    async index(@Body() createRunReqDto: CreateRunReqDto, @Request() request): Promise<CreateRunResDto> {

        return this.runService.store(request.user.accountUuid, createRunReqDto).then((run: Run) => ({
            status: 'success',
            data: {
                uuid: run.uuid,
                id: run.id
            }
        }))
    }

}

export default RunController
