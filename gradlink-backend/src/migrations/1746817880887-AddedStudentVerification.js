export class AddedStudentVerification1746817880887 {
    name = 'AddedStudentVerification1746817880887'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "institutionalEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_5742c5760e5af10a67556261724" UNIQUE ("institutionalEmail")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "institutionalEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_7962eb4dc054a83128d4a2fab72"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "serviceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_7962eb4dc054a83128d4a2fab72" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_7962eb4dc054a83128d4a2fab72"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "serviceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_7962eb4dc054a83128d4a2fab72" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "institutionalEmailVerified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_5742c5760e5af10a67556261724"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "institutionalEmail"`);
    }
}
