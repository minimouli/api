/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isArrayEqual } from './array.helper'

describe('isArrayEqual', () => {

    it('should return true if arrays have identical values', () => {

        const array1 = [1, 2.5, 'hello', false]
        const array2 = [1, 2.5, 'hello', false]

        expect(isArrayEqual(array1, array2)).toBeTruthy()
    })

    it('should return false if arrays have not identical values', () => {

        const array1 = [1, 2.2, 'hello', false]
        const array2 = [1, 2.3, 'hola', true]

        expect(isArrayEqual(array1, array2)).toBeFalsy()
    })

    it('should return false if arrays have not the same length', () => {

        const array1 = [1, 2.5]
        const array2 = [1, 2.5, 'hola']

        expect(isArrayEqual(array1, array2)).toBeFalsy()
    })

    it('should return false if arrays contains objects', () => {

        const array1 = [{ lang: 'en', word: 'hello' }]
        const array2 = [{ lang: 'en', word: 'hello' }]

        expect(isArrayEqual(array1, array2)).toBeFalsy()
    })

    it('should return false if arrays contains NaN', () => {

        const array1 = [Number.NaN]
        const array2 = [Number.NaN]

        expect(isArrayEqual(array1, array2)).toBeFalsy()
    })

})
