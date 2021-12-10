/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NestFactory } from '@nestjs/core'
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import AppModule from './app.module'

@Catch()
class AllExceptionsFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'Internal Server Error'

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus()
            message = exception.message
        }

        response
            .status(statusCode)
            .json({
                status: 'failure',
                statusCode,
                message
            })
    }

}

const bootstrap = async () => {

    const app = await NestFactory.create(AppModule)

    app.useGlobalFilters(new AllExceptionsFilter())
    app.useGlobalPipes(new ValidationPipe())

    const configService = app.get<ConfigService>(ConfigService)

    await app.listen(configService.get<number>('APP_PORT'))
}

bootstrap()
