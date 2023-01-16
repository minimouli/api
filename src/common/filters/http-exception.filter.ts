/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Catch, HttpException } from '@nestjs/common'
import { isObject } from '@nestjs/common/utils/shared.utils'
import { HttpAdapterHost } from '@nestjs/core'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request } from 'express'
import type { ErrorResDto } from '../dto/error.res.dto'

interface ResponseWithMessage<T = unknown> {
    message: T
}

interface ResponseWithError<T = unknown> {
    error: T
}

const isResponseWithMessage = (response: object): response is ResponseWithMessage =>
    'message' in response

const isResponseWithStringMessage = (response: ResponseWithMessage): response is ResponseWithMessage<string | string[]> =>
    typeof response.message === 'string' || Array.isArray(response.message)

const isResponseWithError = (response: object): response is ResponseWithError =>
    'error' in response

const isResponseWithStringError = (response: ResponseWithError): response is ResponseWithError<string> =>
    typeof response.error === 'string'

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost
    ) {}

    private static getMessageFromException(exception: HttpException): string | string[] {

        const response = exception.getResponse()

        if (!isObject(response))
            return response

        if (!isResponseWithMessage(response))
            return exception.message

        if (!isResponseWithStringMessage(response))
            return exception.message

        return response.message
    }

    private static getErrorFromException(exception: HttpException): string {

        const response = exception.getResponse()

        if (!isObject(response))
            return exception.message

        if (!isResponseWithError(response))
            return exception.message

        if (!isResponseWithStringError(response))
            return exception.message

        return response.error
    }

    catch(exception: HttpException, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost
        const context = host.switchToHttp()

        const body: ErrorResDto = {
            status: 'failure',
            statusCode: exception.getStatus(),
            error: HttpExceptionFilter.getErrorFromException(exception),
            message: HttpExceptionFilter.getMessageFromException(exception),
            timestamp: new Date().toISOString(),
            path: context.getRequest<Request>().url,
            method: context.getRequest<Request>().method
        }

        httpAdapter.reply(context.getResponse(), body, exception.getStatus())
    }

}

export {
    HttpExceptionFilter
}
