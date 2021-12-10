/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as mongoose from 'mongoose'

const ExpectAndReceiveProperty = new mongoose.Schema({
    value: {
        type: mongoose.Schema.Types.Mixed, // string or string[]
        required: true
    },
    type: {
        type: String,
        enum: [
            'boolean',
            'number',
            'object',
            'string',
            'undefined'
        ],
        required: true
    }
})

export default ExpectAndReceiveProperty
