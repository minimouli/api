/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { ProjectDto } from './project.dto'

class GetProjectsDataResDto {

    @ApiProperty({
        type: [ProjectDto]
    })
    items: ProjectDto[]

    @ApiProperty({
        type: String,
        nullable: true
    })
    beforeCursor: string | null

    @ApiProperty({
        type: String,
        nullable: true
    })
    afterCursor: string | null

}

class GetProjectsResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: GetProjectsDataResDto
    })
    data: GetProjectsDataResDto

}

export {
    GetProjectsResDto
}
