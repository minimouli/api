/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'
import { Account } from '../../accounts/entities/account.entity'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity({
    name: 'github_credentials'
})
class GitHubCredentials {

    @PrimaryColumn()
    id: string

    @Column()
    githubId: number

    @OneToOne(() => Account, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    account: Account

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
    GitHubCredentials
}
