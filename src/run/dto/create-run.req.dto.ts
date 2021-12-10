/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Syntheses } from '@minimouli/types'
import { IsNumber } from 'class-validator'

class CreateRunReqDto {

    project: Syntheses.ProjectSynthesis

    suites: Syntheses.SuiteSynthesis[]

    @IsNumber()
    duration: number

}

export default CreateRunReqDto
