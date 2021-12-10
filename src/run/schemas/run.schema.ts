/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Syntheses } from '@minimouli/types'
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import ProjectProperty from './properties/ProjectProperty'
import SuiteProperty from './properties/SuiteProperty'

@Schema()
class Run {

    @Prop()
    uuid: string

    @Prop()
    id: string

    @Prop()
    owner_uuid: string

    @Prop(raw(ProjectProperty))
    project: Syntheses.ProjectSynthesis

    @Prop(raw([SuiteProperty]))
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
