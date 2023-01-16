/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console, unicorn/no-process-exit */
import fs from 'node:fs/promises'
import chalk from 'chalk'

const COPYRIGHT_HEADER = [
    '/**',
    ' * Copyright (c) Minimouli',
    ' *',
    ' * This source code is licensed under the MIT license found in the',
    ' * LICENSE file in the root directory of this source tree.',
    ' */', '', ''
].join('\n')

class CopyrightHeaderError extends Error {

    constructor(private filepath: string) {
        super(`The ${filepath} file has not the right copyright header`)
    }

}

const checkCopyrightInFile = async (filepath: string) => {

    const content = await fs.readFile(filepath, {
        encoding: 'utf8'
    })

    if (!content.startsWith(COPYRIGHT_HEADER))
        throw new CopyrightHeaderError(filepath)
}

const check = async (files: string[]) => {

    const checks = files.map(filepath => checkCopyrightInFile(filepath))

    const results = await Promise.allSettled(checks)
    const rejected = results.filter(result => result.status === 'rejected') as PromiseRejectedResult[]

    if (rejected.length === 0)
        return

    console.error('Copyright header check failed for the following files:')
    console.error()

    for (const result of rejected)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
        console.error(` ${chalk.dim('•')} ${result.reason.filepath}`)

    console.error()
    process.exit(1)
}

const files = process.argv.slice(2)
void check(files)
