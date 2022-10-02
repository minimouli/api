/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@nestjs/common'

@Injectable()
class AppService {

    getHello(): string {
        return 'Hello World!'
    }

}

export {
    AppService
}
