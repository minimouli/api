/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import HintProperty from './HintProperty'

const TestProperty = {
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'Status.SUCCESS',
            'Status.FAILURE'
        ],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    hint: {
        type: HintProperty,
        required: false
    }
}

export default TestProperty
