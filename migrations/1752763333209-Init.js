/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1752763333209 {
    name = 'Init1752763333209'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "note" ("id" character varying(32) NOT NULL, "renoteId" character varying(32), "text" text, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id")); COMMENT ON COLUMN "note"."renoteId" IS 'The ID of renote target.'`);
        await queryRunner.query(`CREATE INDEX "IDX_52ccc804d7c69037d558bac4c9" ON "note" ("renoteId") `);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_52ccc804d7c69037d558bac4c96" FOREIGN KEY ("renoteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_52ccc804d7c69037d558bac4c96"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52ccc804d7c69037d558bac4c9"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }
}
