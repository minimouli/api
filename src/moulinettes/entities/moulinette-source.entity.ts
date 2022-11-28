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
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Moulinette } from './moulinette.entity'
import { EntityType } from '../../common/enums/entity-type.enum'

@Entity()
class MoulinetteSource {

    object = EntityType.MoulinetteSource

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @Exclude()
    @Column()
    majorVersion: number

    @Exclude()
    @Column()
    minorVersion: number

    @Exclude()
    @Column()
    patchVersion: number

    @Expose()
    get version(): string {
        return `${this.majorVersion}.${this.minorVersion}.${this.patchVersion}`
    }

    @Exclude()
    @ManyToOne(() => Moulinette, (moulinette) => moulinette.sources, {
        onDelete: 'CASCADE'
    })
    moulinette: Moulinette

    @Column()
    tarball: string

    @Column()
    checksum: string

    @Column({
        type: 'simple-array'
    })
    rules: string[]

    @Column()
    use: number

    @Column()
    isDeprecated: boolean

    @UpdateDateColumn()
    updatedAt: string

    @CreateDateColumn()
    createdAt: string

    @BeforeInsert()
    beforeInsert() {
        this.use = 0
    }

}

export {
    MoulinetteSource
}
