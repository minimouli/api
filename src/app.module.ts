/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import AccountModule from './account/account.module'
import AuthModule from './auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                '.env.local',
                '.env'
            ],
            isGlobal: true
        }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {

                const host = configService.get<string>('MONGO_HOST')
                const port = configService.get<string>('MONGO_PORT')
                const user = configService.get<string>('MONGO_USERNAME')
                const passwd = configService.get<string>('MONGO_PASSWORD')
                const dbname = configService.get<string>('MONGO_DATABASE')

                return {
                    uri: `mongodb://${user}:${passwd}@${host}:${port}/${dbname}`
                }
            },
            inject: [ConfigService]
        }),
        AccountModule,
        AuthModule
    ]
})
class AppModule {}

export default AppModule
