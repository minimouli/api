/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
class Credentials {

    @Prop()
    identity: string

    @Prop()
    secret_hash: string

    @Prop()
    account_uuid: string

}

type CredentialsDocument = Credentials & Document
const CredentialsSchema = SchemaFactory.createForClass(Credentials)

export default Credentials
export {
    CredentialsDocument,
    CredentialsSchema
}
