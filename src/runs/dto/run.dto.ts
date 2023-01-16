/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { SuiteDto } from './suite.dto'
import { AccountDto } from '../../accounts/dto/account.dto'
import { EntityType } from '../../common/enums/entity-type.enum'
import { MoulinetteDto } from '../../moulinettes/dto/moulinette.dto'

class RunDto {

    @ApiProperty()
    id: string

    @ApiProperty({
        type: [SuiteDto]
    })
    suites: SuiteDto[]

    @ApiProperty({
        type: MoulinetteDto
    })
    moulinette: MoulinetteDto

    @ApiProperty()
    moulinetteVersion: string

    @ApiProperty({
        type: AccountDto
    })
    owner: AccountDto

    @ApiProperty()
    uri: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    object: EntityType

}

export {
    RunDto
}
