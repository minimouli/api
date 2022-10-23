/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Expose } from 'class-transformer'
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'
import { MoulinetteSource } from './moulinette-source.entity'
import { Account } from '../../accounts/entities/account.entity'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import { Project } from '../../projects/entities/project.entity'

@Entity()
class Moulinette {

    type = EntityType.Moulinette

    @PrimaryColumn()
    id: string

    @OneToOne(() => Project, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    project: Project

    @OneToMany(() => MoulinetteSource, (source) => source.moulinette)
    sources: MoulinetteSource[]

    @ManyToMany(() => Account)
    @JoinTable()
    maintainers: Account[]

    @Column()
    repository: string

    @Column()
    isOfficial: boolean

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
    Moulinette
}
