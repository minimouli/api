/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { OrganizationDto } from './organization.dto'

class GetOrganizationsDataResDto {

    @ApiProperty({
        type: [OrganizationDto]
    })
    items: OrganizationDto[]

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

class GetOrganizationsResDto {

    @ApiProperty()
    status: 'success'

    @ApiProperty({
        type: GetOrganizationsDataResDto
    })
    data: GetOrganizationsDataResDto

}

export {
    GetOrganizationsResDto
}
