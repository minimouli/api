/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { ProjectDto } from './project.dto'

class GetProjectResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: ProjectDto
    })
    data: ProjectDto
}

export {
    GetProjectResDto
}
