/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Exclude, Expose } from 'class-transformer'
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'
import { MoulinetteSource } from './moulinette-source.entity'
import { Account } from '../../accounts/entities/account.entity'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import { Project } from '../../projects/entities/project.entity'
import { Run } from '../../runs/entities/run.entity'

@Entity()
class Moulinette {

    object = EntityType.Moulinette

    @PrimaryColumn()
    id: string

    @Column()
    repository: string

    @Column()
    isOfficial: boolean

    @Column()
    use: number

    @ManyToOne(() => Project, (project) => project.moulinettes, {
        onDelete: 'CASCADE'
    })
    project: Project

    @OneToMany(() => MoulinetteSource, (source) => source.moulinette)
    sources: MoulinetteSource[]

    @ManyToMany(() => Account)
    @JoinTable()
    maintainers: Account[]

    @Exclude()
    @OneToMany(() => Run, (run) => run.moulinette)
    runs: Run[]

    @Expose()
    get uri(): string {
        return `minimouli:${this.object}:${this.id}`
    }

    @UpdateDateColumn()
    updatedAt: string

    @CreateDateColumn()
    createdAt: string

    @BeforeInsert()
    beforeInsert() {
        this.id = getSecureRandomString(16)
        this.use = 0
    }

}

export {
    Moulinette
}
