/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const SnippetProperty = {
    arguments: {
        type: {
            received: {
                type: [String],
                required: true
            },
            expected: {
                type: [String],
                required: true
            }
        },
        required: true
    },
    method: {
        type: String,
        required: true
    }
}

export default SnippetProperty
