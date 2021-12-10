/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Controller, Get } from '@nestjs/common'
import AppService from './app.service'

@Controller()
class AppController {

    constructor(
        private readonly appService: AppService
    ) {}

    @Get('/')
    index(): string {
        return this.appService.hello()
    }

}

export default AppController
