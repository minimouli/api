/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { v4 as uuidv4 } from 'uuid'
import { Syntheses } from '@minimouli/types'
import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import CreateRunReqDto from './dto/create-run.req.dto'
import Run, { RunDocument } from './schemas/run.schema'

@Injectable()
class RunService {

    constructor(
        @InjectModel(Run.name) private readonly runModel: Model<RunDocument>
    ) {}

    async store(ownerUuid: string, createRunReqDto: CreateRunReqDto): Promise<Run> {

        const {
            project,
            suites,
            duration
        } = createRunReqDto

        const newRun = new Run()

        newRun.uuid = uuidv4()
        newRun.owner_uuid = ownerUuid
        newRun.project = project
        newRun.suites = suites
        newRun.creation_date = Math.floor(Date.now() / 1000)
        newRun.duration = duration

        return this.runModel.create(newRun).then((run: Run | null) => {

            if (!run)
                throw new ServiceUnavailableException()

            return run
        })
    }

}

export default RunService
