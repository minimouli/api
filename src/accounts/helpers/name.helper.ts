/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ALPHANUMERIC } from '../../common/helpers/string.helper'

const validateNickname = (nickname: string): string[] => {

    const errors = []

    if (nickname.length === 0)
        errors.push('The nickname must be longer than or equal to 1 characters')

    if (nickname.length > 32)
        errors.push('The nickname must be shorter than or equal to 32 characters')

    if (nickname !== nickname.trim())
        errors.push('The nickname must not start nor end with a space')

    const forbiddenSubstrings = ['minimouli']
    const forbiddenCharacters = ['\t', '\n', '\r']

    for (const substring of forbiddenSubstrings)
        if (nickname.toLowerCase().includes(substring))
            errors.push(`The nickname must not contain the ${substring} substring`)

    for (const characters of forbiddenCharacters)
        if (nickname.includes(characters))
            errors.push('The nickname must not contain special characters like line feed or tabulation')

    return errors
}

const validateUsername = (username: string): string[] => {

    const errors = []

    if (username.length < 2)
        errors.push('The username must be longer than or equal to 2 characters')

    if (username.length > 32)
        errors.push('The username must be shorter than or equal to 32 characters')

    const forbiddenSubstrings = ['minimouli']
    const allowedCharacters = `${ALPHANUMERIC}+-_`

    for (const substring of forbiddenSubstrings)
        if (username.toLowerCase().includes(substring))
            errors.push(`The username must not contain the ${substring} substring`)

    const isEveryCharactersValid = [...username].every((character) => allowedCharacters.includes(character))

    if (!isEveryCharactersValid)
        errors.push('The username contains invalid characters. Username may only contain alphanumeric characters, hyphen, underscore or plus symbols')

    return errors
}

export {
    validateNickname,
    validateUsername
}
