/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import type { MigrationInterface } from 'typeorm'

const seedersDirectory = path.join(__dirname, '../seeders')

type Constructor<T> = new () => T
type MigrationInterfaceConstructor = Constructor<MigrationInterface>

const getSeederFiles = async (): Promise<string[]> => {
    const dirents = await fs.readdir(seedersDirectory)
    const sortedFiles = [...dirents].sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

    return sortedFiles.map((file) => path.join(seedersDirectory, file))
}

const getSeeders = async (): Promise<MigrationInterface[]> => {
    const seederFiles = await getSeederFiles()

    return Promise.all(seederFiles.map(async (file) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const Seeder = Object.values<MigrationInterfaceConstructor>(await import(file))[0]
        return new Seeder()
    }))
}

export {
    getSeeders
}
