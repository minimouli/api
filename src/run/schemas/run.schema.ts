/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Syntheses } from '@minimouli/types'
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
class Run {

    @Prop()
    uuid: string

    @Prop()
    owner_uuid: string

    @Prop(raw({
        name: { type: String, required: true },
        module: { type: String, required: true },
        module_code: { type: String, required: false }
    }))
    project: Syntheses.ProjectSynthesis

    @Prop()
    suites: Syntheses.SuiteSynthesis[]

    @Prop()
    creation_date: number

    @Prop()
    duration: number

}

type RunDocument = Run & Document
const RunSchema = SchemaFactory.createForClass(Run)

export default Run
export {
    RunDocument,
    RunSchema
}
