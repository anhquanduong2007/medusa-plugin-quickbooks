import { MigrationInterface, QueryRunner } from "typeorm"

export class QbEntity1690100001981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "qb_auth" (
                "id" character varying NOT NULL,
                "x_refresh_token_expires_in" integer NOT NULL,
                "refresh_token" character varying NOT NULL,
                "id_token" character varying NOT NULL,
                "access_token" character varying NOT NULL,
                "token_type" character varying NOT NULL,
                "expires_in" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )`
        )
        await queryRunner.createPrimaryKey("qb_auth", ["id"])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("qb_auth", true)
    }

}
