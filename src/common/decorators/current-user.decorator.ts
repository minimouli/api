/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createParamDecorator } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import type { Account } from '../../accounts/entities/account.entity'

const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): Account => {
    void data

    const request = context.switchToHttp().getRequest<Request>()
    return request.user as Account
})

export {
    CurrentUser
}
