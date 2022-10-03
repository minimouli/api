/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                `.env.${process.env.NODE_ENV ?? ''}.local`,
                '.env.local',
                `.env.${process.env.NODE_ENV ?? ''}`,
                '.env'
            ],
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST'),
                port: configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USERNAME'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DATABASE'),
                entities: [`${__dirname}/**/entities/*.entity.{js,ts}`],
                synchronize: configService.get<string>('POSTGRES_SYNCHRONIZE') === 'true'
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
class AppModule {}

export {
    AppModule
}
