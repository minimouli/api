/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
class Account {

    @Prop()
    uuid: string

    @Prop()
    creation_date: number

}

type AccountDocument = Account & Document
const AccountSchema = SchemaFactory.createForClass(Account)

export default Account
export {
    AccountDocument,
    AccountSchema
}
