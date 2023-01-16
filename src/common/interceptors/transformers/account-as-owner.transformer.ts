/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { instanceToPlain } from 'class-transformer'
import { Transformer } from './transformer'
import { CaslAction } from '../../enums/casl-action.enum'
import type { AccountDto } from '../../../accounts/dto/account.dto'
import type { Account } from '../../../accounts/entities/account.entity'

class AccountAsOwnerTransformer extends Transformer<AccountDto> {

    transform(user: Account | undefined, data: AccountDto): Record<string, unknown> {

        if (user === undefined)
            return instanceToPlain(data)

        const ability = this.caslAbilityFactory.createForAccount(user)

        if (!ability.can(CaslAction.Read, data as Account))
            return instanceToPlain(data)

        return instanceToPlain(data, { groups: ['owner'] })
    }

}

export {
    AccountAsOwnerTransformer
}
