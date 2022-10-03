/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DataSource } from 'typeorm'

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number.parseInt(process.env.POSTGRES_PORT ?? '5432'),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['src/**/entities/*.entity.ts'],
    migrations: ['database/migrations/*.ts'],
    synchronize: false
})

export {
    AppDataSource
}
