/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import crypto from 'node:crypto'

const NUMERIC = '0123456789'
const LOWER_CASE_ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const UPPER_CASE_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHANUMERIC = `${LOWER_CASE_ALPHA}${UPPER_CASE_ALPHA}${NUMERIC}`

type NumberGenerator = (max: number) => number

const classicNumberGenerator = (max: number) => Math.floor(Math.random() * max)
const secureNumberGenerator = (max: number) => crypto.randomInt(max)

const getRandomString = (length: number, alphabet = ALPHANUMERIC, generator: NumberGenerator = classicNumberGenerator) => Array.from({ length })
    .map(() => generator(alphabet.length))
    .map((index) => alphabet[index])
    .join('')

const getSecureRandomString = (length: number, alphabet = ALPHANUMERIC) => getRandomString(length, alphabet, secureNumberGenerator)

export {
    getRandomString,
    getSecureRandomString,
    NUMERIC,
    LOWER_CASE_ALPHA,
    UPPER_CASE_ALPHA,
    ALPHANUMERIC
}
