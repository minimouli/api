/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PartialType } from '@nestjs/swagger'
import { CreateOrganizationReqDto } from './create-organization.req.dto'

class UpdateOrganizationReqDto extends PartialType(CreateOrganizationReqDto) {}

export {
    UpdateOrganizationReqDto
}
