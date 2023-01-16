/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { CaslAbilityFactory } from './casl-ability.factory'

@Module({
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory]
})
class CaslModule {}

export {
    CaslModule
}
