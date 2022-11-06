/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Exclude, Expose } from 'class-transformer'
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import { Run } from '../../runs/entities/run.entity'
import { AuthToken } from '../../tokens/entities/auth-token.entity'
import type { Permission } from '../../common/enums/permission.enum'

@Entity()
class Account {

    type = EntityType.Account

    @PrimaryColumn()
    id: string

    @Column()
    nickname: string

    @Column({
        unique: true
    })
    username: string

    @Column()
    @Expose({
        groups: ['owner']
    })
    email: string

    @Column({
        type: 'simple-array'
    })
    @Expose({
        groups: ['owner']
    })
    permissions: Permission[]

    @OneToMany(() => AuthToken, (authToken) => authToken.account)
    authTokens: AuthToken[]

    @Exclude()
    @OneToMany(() => Run, (run) => run.owner)
    runs: Run[]

    @Expose()
    get uri(): string {
        return `minimouli:${this.type}:${this.id}`
    }

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
