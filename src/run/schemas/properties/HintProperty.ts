/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as mongoose from 'mongoose'
import ExpectAndReceiveProperty from './ExpectAndReceiveProperty'
import SnippetProperty from './SnippetProperty'

const HintProperty = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'Hint.COMP',
            'Hint.EQUAL',
            'Hint.STREAM_DIFF',
            'Hint.STRING_DIFF',
            'Hint.TIMEOUT',
            'Hint.MATCHER_ERROR'
        ],
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
    category: {
        type: String,
        enum: [
            'Category.OUTPUT',
            'Category.EXIT_CODE',
            'Category.TIMEOUT'
        ],
        required: false
    },

    // CompHint
    symbol: {
        type: String,
        enum: ['<', '<=', '>', '>='],
        required: false
    },

    // TimeoutHint
    timeout: {
        type: Number,
        required: false
    },

    received: {
        type: ExpectAndReceiveProperty,
        required: false
    },
    expected: {
        type: ExpectAndReceiveProperty,
        required: false
    },

    message: {
        type: String,
        required: false
    },
    snippet: {
        type: SnippetProperty,
        required: false
    }
})

export default HintProperty
