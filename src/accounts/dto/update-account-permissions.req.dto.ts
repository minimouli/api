/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { Permission } from '../../common/enums/permission.enum'

class UpdateAccountPermissionsReqDto {

    @ApiProperty()
    @IsEnum(Permission, {
        each: true
    })
    permissions: Permission[]

}

export {
    UpdateAccountPermissionsReqDto
}
