/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ProjectsService } from './projects.service'
import { CreateProjectReqDto } from './dto/create-project.req.dto'
import { GetProjectResDto } from './dto/get-project.res.dto'
import { GetProjectsResDto } from './dto/get-projects.res.dto'
import { GetProjectsQueryDto } from './dto/get-projects.query.dto'
import { UpdateProjectReqDto } from './dto/update-project.req.dto'
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

        const project = await this.projectsService.create(body, currentUser)

        return {
            status: 'success',
            data: project
        }
    }

    @Get('/project/:projectId')
    @ApiOperation({ summary: 'Get information about a project' })
    @ApiOkResponse({
        type: GetProjectResDto,
        description: 'Get information about a project'
    })
    @ApiNotFoundResponse({
        type: ErrorResDto,
        description: 'Not Found'
    })
    async getProject(@Param('projectId') projectId: string): Promise<GetProjectResDto> {

        const project = await this.projectsService.findById(projectId)

        return {
            status: 'success',
            data: project
        }
    }

    @Patch('/project/:projectId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update information about a project' })
    @ApiOkResponse({
        type: GetProjectResDto,
        description: 'Update information about a project'
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
    async updateProjectInformation(
        @CurrentUser() currentUser: Account,
        @Param('projectId') projectId: string,
        @Body() body: UpdateProjectReqDto
    ): Promise<GetProjectResDto> {

        const updatedProject = await this.projectsService.updateById(projectId, body, currentUser)

        return {
            status: 'success',
            data: updatedProject
        }
    }

    @Delete('/project/:projectId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a project' })
    @ApiNoContentResponse({
        description: 'Delete a project'
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
    async deleteProject(@CurrentUser() currentUser: Account, @Param('projectId') projectId: string): Promise<void> {
        await this.projectsService.deleteById(projectId, currentUser)
    }

    @Get('/projects')
    @ApiOperation({ summary: 'List projects' })
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
        type: GetProjectsResDto,
        description: 'List projects'
    })
    @ApiBadRequestResponse({
        type: ErrorResDto,
        description: 'Bad Request'
    })
    async listProjects(@Query() query: GetProjectsQueryDto): Promise<GetProjectsResDto> {

        const { cursor, data } = await this.projectsService.list(query)

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
    ProjectsController
}
