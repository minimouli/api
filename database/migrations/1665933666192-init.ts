/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class Init1665933666192 implements MigrationInterface {

    public name = 'Init1665933666192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "auth_token" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lastActive" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" character varying, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "account" ("id" character varying NOT NULL, "nickname" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "permissions" text NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b" UNIQUE ("username"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "github_credentials" ("id" character varying NOT NULL, "githubId" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" character varying, CONSTRAINT "REL_450cca434e2b2c896a850adcd3" UNIQUE ("accountId"), CONSTRAINT "PK_c2882693875a52885319e3f7899" PRIMARY KEY ("id"))')
        await queryRunner.query('ALTER TABLE "auth_token" ADD CONSTRAINT "FK_3d7910be62df26229e2d3b5a9ee" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "github_credentials" ADD CONSTRAINT "FK_450cca434e2b2c896a850adcd30" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "github_credentials" DROP CONSTRAINT "FK_450cca434e2b2c896a850adcd30"')
        await queryRunner.query('ALTER TABLE "auth_token" DROP CONSTRAINT "FK_3d7910be62df26229e2d3b5a9ee"')
        await queryRunner.query('DROP TABLE "github_credentials"')
        await queryRunner.query('DROP TABLE "account"')
        await queryRunner.query('DROP TABLE "auth_token"')
    }

}

export {
    Init1665933666192
}
