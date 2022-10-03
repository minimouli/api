/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const bootstrap = async () => {

    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)

    const logger = new Logger('Bootstrap')

    const appPort = configService.get<number>('APP_PORT') ?? 9000
    const environment = configService.get<string>('NODE_ENV')

    if (environment === undefined) {
        logger.error('The environment (NODE_ENV) is not defined')
        return app.close()
    }

    await app.listen(appPort)
    logger.log(`[ENV=${environment}] Application running on port ${appPort}`)
}

void bootstrap()
