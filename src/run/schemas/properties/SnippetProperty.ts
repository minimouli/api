/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as mongoose from 'mongoose'

const SnippetArgumentProperty = new mongoose.Schema({
    received: {
        type: [String],
        required: true
    },
    expected: {
        type: [String],
        required: true
    }
}, {_id: false})

const SnippetProperty = new mongoose.Schema({
    arguments: {
        type: SnippetArgumentProperty,
        required: true
    },
    method: {
        type: String,
        required: true
    }
}, {_id: false})

export default SnippetProperty
