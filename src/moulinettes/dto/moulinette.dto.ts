/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiProperty } from '@nestjs/swagger'
import { MoulinetteSourceDto } from './moulinette-source.dto'
import { AccountDto } from '../../accounts/dto/account.dto'
import { EntityType } from '../../common/enums/entity-type.enum'
import { ProjectDto } from '../../projects/dto/project.dto'

class MoulinetteDto {

    @ApiProperty()
    id: string

    @ApiProperty()
    repository: string

    @ApiProperty()
    isOfficial: boolean

    @ApiProperty()
    use: number

    @ApiProperty({
        type: ProjectDto
    })
    project: ProjectDto

    @ApiProperty({
        type: [MoulinetteSourceDto]
    })
    sources: MoulinetteSourceDto[]

    @ApiProperty({
        type: [AccountDto]
    })
    maintainers: AccountDto[]

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
    MoulinetteDto
}
