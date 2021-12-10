/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Syntheses } from '@minimouli/types'

class ShowRunResDto {
    status: 'success'
    data: {
        uuid: string,
        owner_uuid: string,
        project: Syntheses.ProjectSynthesis,
        suites: Syntheses.SuiteSynthesis[],
        creation_date: number,
        duration: number
    }
}

export default ShowRunResDto
