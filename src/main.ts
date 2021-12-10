/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as mongoose from 'mongoose'
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
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
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

        if (exception instanceof mongoose.Error.ValidationError) {
            statusCode = 400
            message = 'Bad Request'
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

    const docConfig = new DocumentBuilder()
        .setTitle('Minimouli')
        .setDescription('The API that runs the minimouli platform.')
        .setVersion('1.0')
        .addBearerAuth()
        .build()

    const doc = SwaggerModule.createDocument(app, docConfig)
    SwaggerModule.setup('api', app, doc)

    const configService = app.get<ConfigService>(ConfigService)

    await app.listen(configService.get<number>('APP_PORT'))
}

bootstrap()
