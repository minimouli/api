/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Logger } from '@nestjs/common'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { Observable } from 'rxjs'
import type { Account } from '../../accounts/entities/account.entity'

class LoggingInterceptor implements NestInterceptor {

    private readonly logger = new Logger('HTTP')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>()
        const response = context.switchToHttp().getResponse<Response>()

        const account = request.user as Account | undefined
        const { method, originalUrl } = request
        const { statusCode } = response

        if (account !== undefined)
            this.logger.log(`${account.id}: ${statusCode} ${method} ${originalUrl}`)
        else
            this.logger.log(`${statusCode} ${method} ${originalUrl}`)

        return next.handle()
    }

}

export {
    LoggingInterceptor
}
