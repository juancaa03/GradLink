export class InitSchema1744101520124 {
    name = 'InitSchema1744101520124'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'student', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services_tags_tags" ("servicesId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_c4d107b3630c77e7a164e0edb50" PRIMARY KEY ("servicesId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb3c787985ba0b6768a6491524" ON "services_tags_tags" ("servicesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_024975c867613525a34ab0b562" ON "services_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_3905389899d96c4f1b3619f68d5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_tags_tags" ADD CONSTRAINT "FK_eb3c787985ba0b6768a64915243" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "services_tags_tags" ADD CONSTRAINT "FK_024975c867613525a34ab0b5628" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "services_tags_tags" DROP CONSTRAINT "FK_024975c867613525a34ab0b5628"`);
        await queryRunner.query(`ALTER TABLE "services_tags_tags" DROP CONSTRAINT "FK_eb3c787985ba0b6768a64915243"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_3905389899d96c4f1b3619f68d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_024975c867613525a34ab0b562"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb3c787985ba0b6768a6491524"`);
        await queryRunner.query(`DROP TABLE "services_tags_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
