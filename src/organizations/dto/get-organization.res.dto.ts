/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { OrganizationDto } from './organization.dto'

class GetOrganizationResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: OrganizationDto
    })
    data: OrganizationDto

}

export {
    GetOrganizationResDto
}
