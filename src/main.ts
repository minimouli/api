/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import AppModule from './app.module'

const bootstrap = async () => {

    const app = await NestFactory.create(AppModule)

    const configService = app.get<ConfigService>(ConfigService)

    await app.listen(configService.get<number>('APP_PORT'))
}

bootstrap()
