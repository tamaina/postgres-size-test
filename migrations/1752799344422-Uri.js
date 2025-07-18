/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Uri1752799344422 {
    name = 'Uri1752799344422'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "uri" ("id" character varying(32) NOT NULL, "text" text, "uriu" character varying(512), "uri" character varying(512), CONSTRAINT "PK_b619b822346b47994e91acd6ed7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_410acbc30b592c07d9789dc80e" ON "uri" ("uriu") `);
        await queryRunner.query(`CREATE INDEX "IDX_f9780e670b8af92bb34e0307b0" ON "uri" ("uri") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_f9780e670b8af92bb34e0307b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_410acbc30b592c07d9789dc80e"`);
        await queryRunner.query(`DROP TABLE "uri"`);
    }
}
