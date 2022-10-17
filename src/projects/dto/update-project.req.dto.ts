/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PartialType } from '@nestjs/swagger'
import { CreateProjectReqDto } from './create-project.req.dto'

class UpdateProjectReqDto extends PartialType(CreateProjectReqDto) {}

export {
    UpdateProjectReqDto
}
