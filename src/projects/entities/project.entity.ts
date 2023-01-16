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
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import { Organization } from '../../organizations/entities/organization.entity'
import { Moulinette } from '../../moulinettes/entities/moulinette.entity'

@Entity()
class Project {

    object = EntityType.Project

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    displayName: string

    @Column()
    cycle: number

    @ManyToOne(() => Organization, (organization) => organization.projects, {
        onDelete: 'CASCADE'
    })
    organization: Organization

    @Exclude()
    @OneToMany(() => Moulinette, (moulinette) => moulinette.project)
    moulinettes: Moulinette[]

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
    }

}

export {
    Project
}
