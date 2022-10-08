/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const isArrayEqual = <T>(array1: T[], array2: T[]) => {

    if (array1.length !== array2.length)
        return false

    return array1.every((value1, key) => value1 === array2[key])
}

export {
    isArrayEqual
}
