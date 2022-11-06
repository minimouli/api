/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Expose } from 'class-transformer'
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Account } from '../../accounts/entities/account.entity'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import { Moulinette } from '../../moulinettes/entities/moulinette.entity'
import type { SuiteDto } from '../dto/suite.dto'

@Entity()
class Run {

    type = EntityType.Run

    @PrimaryColumn()
    id: string

    @Column({
        type: 'simple-json'
    })
    suites: SuiteDto[]

    @ManyToOne(() => Moulinette, (moulinette) => moulinette.runs, {
        onDelete: 'CASCADE'
    })
    moulinette: Moulinette

    @Column()
    moulinetteVersion: string

    @Expose({
        groups: ['owner']
    })
    @ManyToOne(() => Account, (account) => account.runs, {
        onDelete: 'CASCADE'
    })
    owner: Account

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
    Run
}
