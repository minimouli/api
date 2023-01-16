/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { validateNickname, validateUsername } from './name.helper'

describe('names.helper', () => {

    describe('validateNickname', () => {

        it('should fail if the nickname is shorter than 1 characters', () => {
            expect(validateNickname('')).toStrictEqual(['The nickname must be longer than or equal to 1 characters'])
        })

        it('should fail if the nickname is longer than 32 characters', () => {
            expect(validateNickname('a'.repeat(33))).toStrictEqual(['The nickname must be shorter than or equal to 32 characters'])
        })

        it('should fail if the nickname starts with a space', () => {
            expect(validateNickname(' nickname')).toStrictEqual(['The nickname must not start nor end with a space'])
        })

        it('should fail if the nickname ends with a space', () => {
            expect(validateNickname('nickname ')).toStrictEqual(['The nickname must not start nor end with a space'])
        })

        it('should fail if the nickname contains the minimouli substring', () => {
            expect(validateNickname('-> minimouli <-')).toStrictEqual(['The nickname must not contain the minimouli substring'])
        })

        it('should fail if the nickname contains the tabulation character', () => {
            expect(validateNickname('nick\tname')).toStrictEqual(['The nickname must not contain special characters like line feed or tabulation'])
        })

        it('should fail if the nickname contains the line feed character', () => {
            expect(validateNickname('nick\nname')).toStrictEqual(['The nickname must not contain special characters like line feed or tabulation'])
        })

        it('should fail if the nickname contains the carriage return character', () => {
            expect(validateNickname('nick\rname')).toStrictEqual(['The nickname must not contain special characters like line feed or tabulation'])
        })

        it('should accept a correct nickname', () => {
            expect(validateNickname('nickname')).toHaveLength(0)
        })
    })

    describe('validateUsername', () => {

        it('should fail if the username is shorter than 2 characters', () => {
            expect(validateUsername('a')).toStrictEqual(['The username must be longer than or equal to 2 characters'])
        })

        it('should fail if the username is longer than 32 characters', () => {
            expect(validateUsername('a'.repeat(33))).toStrictEqual(['The username must be shorter than or equal to 32 characters'])
        })

        it('should fail if the username contains the minimouli substring', () => {
            expect(validateUsername('aminimoulia')).toStrictEqual(['The username must not contain the minimouli substring'])
        })

        it('should fail if the username contains invalid characters', () => {
            expect(validateUsername('#@:!')).toStrictEqual(['The username contains invalid characters. Username may only contain alphanumeric characters, hyphen, underscore or plus symbols'])
        })

        it('should accept a correct username', () => {
            expect(validateUsername('username')).toHaveLength(0)
        })
    })
})
