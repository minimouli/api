/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import RunService from './run.service'
import CreateRunReqDto from './dto/create-run.req.dto'
import CreateRunResDto from './dto/create-run.res.dto'
import Run from './schemas/run.schema'
import JwtGuard from '../auth/guards/jwt-auth.guard'

@Controller('/run')
@ApiTags('run')
@ApiBearerAuth()
class RunController {

    constructor(
        private readonly runService: RunService
    ) {}

    @Post('/')
    @UseGuards(JwtGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    async index(@Body() createRunReqDto: CreateRunReqDto, @Request() request): Promise<CreateRunResDto> {

        return this.runService.store(request.user.accountUuid, createRunReqDto).then((run: Run) => ({
            status: 'success',
            data: {
                uuid: run.uuid
            }
        }))
    }

}

export default RunController
