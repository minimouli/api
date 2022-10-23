/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateMoulinetteReqDto } from './create-moulinette.req.dto'

class UpdateMoulinetteReqDto extends PartialType(OmitType(CreateMoulinetteReqDto, ['project', 'isOfficial'] as const)) {}

export {
    UpdateMoulinetteReqDto
}
