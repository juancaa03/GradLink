export class AddOrder1744102367911 {
    name = 'AddOrder1744102367911'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "status" character varying NOT NULL DEFAULT 'processing', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "serviceId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_7962eb4dc054a83128d4a2fab72" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_7962eb4dc054a83128d4a2fab72"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }
}
