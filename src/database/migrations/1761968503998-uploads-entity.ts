import { MigrationInterface, QueryRunner } from "typeorm";

export class UploadsEntity1761968503998 implements MigrationInterface {
    name = 'UploadsEntity1761968503998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upload" ("_id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_8c4478cf0c29280ac23906112c7" UNIQUE ("uuid"), CONSTRAINT "PK_d3ede16fdbccfd3b72af5d60759" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "FK_ea69a221d94b98c476875cec7d5" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "FK_ea69a221d94b98c476875cec7d5"`);
        await queryRunner.query(`DROP TABLE "upload"`);
    }

}
