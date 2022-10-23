/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class Init1666545911315 implements MigrationInterface {

    public name = 'Init1666545911315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "auth_token" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lastActive" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" character varying, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "account" ("id" character varying NOT NULL, "nickname" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "permissions" text NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b" UNIQUE ("username"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "project" ("id" character varying NOT NULL, "name" character varying NOT NULL, "organization" character varying NOT NULL, "cycle" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "moulinette" ("id" character varying NOT NULL, "repository" character varying NOT NULL, "isOfficial" boolean NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" character varying, CONSTRAINT "REL_7b29a3c30032b432ea21ea38d8" UNIQUE ("projectId"), CONSTRAINT "PK_b2c68b4438357bb1dbca06b38f2" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "moulinette_source" ("id" SERIAL NOT NULL, "majorVersion" integer NOT NULL, "minorVersion" integer NOT NULL, "patchVersion" integer NOT NULL, "tarball" character varying NOT NULL, "checksum" character varying NOT NULL, "rules" text NOT NULL, "isDeprecated" boolean NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "moulinetteId" character varying, CONSTRAINT "PK_9bbb355c8b0f94813c6c25cda06" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "github_credentials" ("id" character varying NOT NULL, "githubId" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" character varying, CONSTRAINT "REL_450cca434e2b2c896a850adcd3" UNIQUE ("accountId"), CONSTRAINT "PK_c2882693875a52885319e3f7899" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "moulinette_maintainers_account" ("moulinetteId" character varying NOT NULL, "accountId" character varying NOT NULL, CONSTRAINT "PK_feac580f94afc08bcf46c1fbba5" PRIMARY KEY ("moulinetteId", "accountId"))')
        await queryRunner.query('CREATE INDEX "IDX_cc2d8030a8d1783de82d54d693" ON "moulinette_maintainers_account" ("moulinetteId") ')
        await queryRunner.query('CREATE INDEX "IDX_96a45e1b95dd0d06487f7f65e3" ON "moulinette_maintainers_account" ("accountId") ')
        await queryRunner.query('ALTER TABLE "auth_token" ADD CONSTRAINT "FK_3d7910be62df26229e2d3b5a9ee" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "moulinette" ADD CONSTRAINT "FK_7b29a3c30032b432ea21ea38d8e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "moulinette_source" ADD CONSTRAINT "FK_0cb76d48691d024eac3bdcd3ef5" FOREIGN KEY ("moulinetteId") REFERENCES "moulinette"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "github_credentials" ADD CONSTRAINT "FK_450cca434e2b2c896a850adcd30" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "moulinette_maintainers_account" ADD CONSTRAINT "FK_cc2d8030a8d1783de82d54d693a" FOREIGN KEY ("moulinetteId") REFERENCES "moulinette"("id") ON DELETE CASCADE ON UPDATE CASCADE')
        await queryRunner.query('ALTER TABLE "moulinette_maintainers_account" ADD CONSTRAINT "FK_96a45e1b95dd0d06487f7f65e3e" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "moulinette_maintainers_account" DROP CONSTRAINT "FK_96a45e1b95dd0d06487f7f65e3e"')
        await queryRunner.query('ALTER TABLE "moulinette_maintainers_account" DROP CONSTRAINT "FK_cc2d8030a8d1783de82d54d693a"')
        await queryRunner.query('ALTER TABLE "github_credentials" DROP CONSTRAINT "FK_450cca434e2b2c896a850adcd30"')
        await queryRunner.query('ALTER TABLE "moulinette_source" DROP CONSTRAINT "FK_0cb76d48691d024eac3bdcd3ef5"')
        await queryRunner.query('ALTER TABLE "moulinette" DROP CONSTRAINT "FK_7b29a3c30032b432ea21ea38d8e"')
        await queryRunner.query('ALTER TABLE "auth_token" DROP CONSTRAINT "FK_3d7910be62df26229e2d3b5a9ee"')
        await queryRunner.query('DROP INDEX "public"."IDX_96a45e1b95dd0d06487f7f65e3"')
        await queryRunner.query('DROP INDEX "public"."IDX_cc2d8030a8d1783de82d54d693"')
        await queryRunner.query('DROP TABLE "moulinette_maintainers_account"')
        await queryRunner.query('DROP TABLE "github_credentials"')
        await queryRunner.query('DROP TABLE "moulinette_source"')
        await queryRunner.query('DROP TABLE "moulinette"')
        await queryRunner.query('DROP TABLE "project"')
        await queryRunner.query('DROP TABLE "account"')
        await queryRunner.query('DROP TABLE "auth_token"')
    }

}

export {
    Init1666545911315
}
