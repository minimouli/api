/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import { Project } from '../../projects/entities/project.entity'

@Entity()
class Organization {

    type = EntityType.Organization

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    displayName: string

    @Exclude()
    @OneToMany(() => Project, (project) => project.organization)
    projects: Project[]

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
    Organization
}
