/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as bcrypt from 'bcrypt'
import {
    BadRequestException,
    Injectable,
    ServiceUnavailableException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import LoginReqDto from './dto/login.req.dto'
import Credentials, { CredentialsDocument } from './schemas/credentials.schema'
import { JwtPayload } from './strategies/jwt.strategy'
import AccountService from '../account/account.service'
import Account from '../account/schemas/account.schema'

@Injectable()
class AuthService {

    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService,
        @InjectModel(Credentials.name) private readonly credentialsModel: Model<CredentialsDocument>
    ) {}

    async findByIdentity(identity: string): Promise<Credentials | null> {
        return this.credentialsModel.findOne({ identity })
    }

    async findOne(identity: string, secret: string): Promise<Credentials | null> {

        return this.findByIdentity(identity).then((credentials: Credentials | null) => {

            if (!credentials)
                return null

            return bcrypt.compare(secret, credentials.secret_hash).then((result: boolean) => {

                if (!result)
                    return null

                return credentials
            })
        })
    }

    async signup(identity: string, secret: string): Promise<Account> {

        return this.accountService.create().then((account: Account) => {

            return bcrypt.hash(secret, 12).then((secretHash: string) => {

                const newCredentials = new Credentials()

                newCredentials.identity = identity
                newCredentials.secret_hash = secretHash
                newCredentials.account_uuid = account.uuid

                return this.credentialsModel.create(newCredentials)
            })
            .then((credentials: Credentials | null) => {

                if (!credentials)
                    throw new ServiceUnavailableException()

                return account
            })
        })
    }

    async signin(identity: string, secret: string): Promise<Account> {

        return this.findOne(identity, secret).then((credentials: Credentials | null) => {

            if (!credentials)
                throw new BadRequestException('Unable to login')

            return this.accountService.findByUuid(credentials.account_uuid)
        })
        .then((account: Account | null) => {

            if (!account)
                throw new BadRequestException('The credentials does not correspond to an account')

            return account
        })
    }

    async login(loginReqDto: LoginReqDto): Promise<Account> {

        const {
            identity,
            secret
        } = loginReqDto

        return this.findByIdentity(identity).then((credentials: Credentials | null) => {

            if (!credentials)
                return this.signup(identity, secret)

            return this.signin(identity, secret)
        })
    }

    generateToken(account: Account): string {

        const payload: JwtPayload = {
            sub: account.uuid
        }

        return this.jwtService.sign(payload)
    }

}

export default AuthService
