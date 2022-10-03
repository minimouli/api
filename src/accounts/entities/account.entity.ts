/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class Account {

    type = EntityType.Account

    @PrimaryColumn()
    id: string

    @Column()
    nickname: string

    @Column()
    username: string

    @Column()
    email: string

    @UpdateDateColumn()
    updatedAt: string

    @CreateDateColumn()
    createdAt: string

    @BeforeInsert()
    beforeInsert() {
        this.id = getSecureRandomString(16)
    }

}

export {
    Account
}
