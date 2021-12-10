/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as mongoose from 'mongoose'
import TestProperty from './TestProperty'

const SuiteProperty = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tests: {
        type: [TestProperty],
        required: true
    }
})

SuiteProperty.add({
    suites: {
        type: [SuiteProperty],
        required: true
    }
})

export default SuiteProperty
