/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Catch, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request } from 'express'
import type { ErrorResDto } from '../dto/error.res.dto'

@Catch()
class AllExceptionsFilter implements ExceptionFilter {

    private readonly logger = new Logger(AllExceptionsFilter.name)

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost
    ) {}

    catch(exception: unknown, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost
        const context = host.switchToHttp()

        if (exception instanceof Error)
            this.logger.error(`Caught a non HTTP exception: ${exception.stack ?? exception.message}`)
        else
            this.logger.error('Caught a non HTTP exception')

        const body: ErrorResDto = {
            status: 'failure',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            message: 'Internal Server Error',
            timestamp: new Date().toISOString(),
            path: context.getRequest<Request>().url,
            method: context.getRequest<Request>().method
        }

        httpAdapter.reply(context.getResponse(), body, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

export {
    AllExceptionsFilter
}
