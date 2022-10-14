/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsModule } from './accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import { CaslModule } from './casl/casl.module'
import { TokensModule } from './tokens/tokens.module'

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
        ScheduleModule.forRoot(),
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
        }),
        AccountsModule,
        AuthModule,
        CaslModule,
        TokensModule
    ],
    providers: [
        {
            provide: APP_PIPE,
            useFactory: () => new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true
            })
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
class AppModule {}

export {
    AppModule
}
