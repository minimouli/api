/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { EntityType } from '../../common/enums/entity-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class Organization {

    type = EntityType.Organization

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    displayName: string

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
        this.name = this.name.toLowerCase()
    }

}

export {
    Organization
}
