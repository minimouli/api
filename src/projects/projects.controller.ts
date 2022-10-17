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
import { ProjectsService } from './projects.service'
import { CreateProjectReqDto } from './dto/create-project.req.dto'
import { GetProjectResDto } from './dto/get-project.res.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'

@Controller('/')
@ApiTags('projects')
@ApiBearerAuth()
class ProjectsController {

    constructor(
        private readonly projectsService: ProjectsService
    ) {}

    @Post('/project')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new project' })
    @ApiCreatedResponse({
        type: GetProjectResDto,
        description: 'Create a new project'
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
    async createProject(@CurrentUser() currentUser: Account, @Body() body: CreateProjectReqDto): Promise<GetProjectResDto> {

        const project = await this.projectsService.createProject(body.name, body.organization, currentUser)

        return {
            status: 'success',
            data: project
        }
    }

}

export {
    ProjectsController
}
