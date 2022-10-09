/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class Init1665275852261 implements MigrationInterface {

    public name = 'Init1665275852261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "account" ("id" character varying NOT NULL, "nickname" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_20fc404a1f1ab8cd9cccf6f6483" UNIQUE ("username"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))')
        await queryRunner.query('CREATE TABLE "github_credentials" ("id" character varying NOT NULL, "githubId" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" character varying, CONSTRAINT "REL_450cca434e2b2c896a850adcd3" UNIQUE ("accountId"), CONSTRAINT "PK_c2882693875a52885319e3f7899" PRIMARY KEY ("id"))')
        await queryRunner.query('ALTER TABLE "github_credentials" ADD CONSTRAINT "FK_450cca434e2b2c896a850adcd30" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "github_credentials" DROP CONSTRAINT "FK_450cca434e2b2c896a850adcd30"')
        await queryRunner.query('DROP TABLE "github_credentials"')
        await queryRunner.query('DROP TABLE "account"')
    }

}

export {
    Init1665275852261
}
