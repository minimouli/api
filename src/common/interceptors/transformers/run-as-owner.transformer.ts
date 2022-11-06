/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { instanceToPlain } from 'class-transformer'
import { Transformer } from './transformer'
import { CaslAction } from '../../enums/casl-action.enum'
import type { Account } from '../../../accounts/entities/account.entity'
import type { Run } from '../../../runs/entities/run.entity'
import type { RunDto } from '../../../runs/dto/run.dto'

class RunAsOwnerTransformer extends Transformer<RunDto> {

    transform(user: Account | undefined, data: RunDto): Record<string, unknown> {

        if (user === undefined)
            return instanceToPlain(data)

        const ability = this.caslAbilityFactory.createForAccount(user)

        if (!ability.can(CaslAction.Read, data as Run))
            return instanceToPlain(data)

        return instanceToPlain(data, { groups: ['owner'] })
    }

}

export {
    RunAsOwnerTransformer
}
