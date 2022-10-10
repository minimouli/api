/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Exclude } from 'class-transformer'
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Account } from '../../accounts/entities/account.entity'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class AuthToken {

    type = EntityType.AuthToken

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Exclude()
    @ManyToOne(() => Account, (account) => account.authTokens)
    account: Account

    @Column()
    lastActive: string

    @Column()
    expiresAt: string

    @UpdateDateColumn()
    updatedAt: string

    @CreateDateColumn()
    createdAt: string

    @BeforeInsert()
    beforeInsert() {
        this.id = getSecureRandomString(16)
        this.lastActive = new Date().toISOString()
    }

}

export {
    AuthToken
}
