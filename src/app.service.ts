/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@nestjs/common'

@Injectable()
class AppService {

    hello(): string {
        return 'hello world'
    }

}

export default AppService
