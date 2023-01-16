/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console, no-await-in-loop */
import chalk from 'chalk'
import { AppDataSource } from '../typeorm.data-source'
import { getSeeders } from '../database/helpers/seeders.helper'

const run = async () => {

    const { manager } = await AppDataSource.initialize()
    const queryRunner = manager.connection.createQueryRunner()

    const seeders = await getSeeders()

    for (const seeder of seeders) {
        console.log(`${chalk.green('up')} ${seeder.name ?? ''}`)
        await seeder.up(queryRunner)
    }

    return AppDataSource.destroy()
}

void run()
