/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@nestjs/common'
import { map } from 'rxjs'
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory'
import type { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import type { Account } from '../../../accounts/entities/account.entity'

interface Response<T> {
    data: T
}

@Injectable()
abstract class Transformer<T, R = Record<string, unknown>> implements NestInterceptor<Response<T>, Response<R>> {

    protected constructor(
        protected readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    abstract transform(user: Account | undefined, data: T): R

    intercept(context: ExecutionContext, next: CallHandler<Response<T>>): Observable<Response<R>> {

        const request = context.switchToHttp().getRequest<Request>()
        const currentUser: Account | undefined = request.user as Account

        return next.handle().pipe(
            map((response) => {

                const transformedData = this.transform(currentUser, response.data)

                return {
                    ...response,
                    data: transformedData
                }
            })
        )
    }

}

export {
    Transformer
}
