/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ProjectProperty = {
    name: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
    module_code: {
        type: String,
        required: false
    }
}

export default ProjectProperty
