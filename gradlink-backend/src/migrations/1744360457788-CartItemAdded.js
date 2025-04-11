export class CartItemAdded1744360457788 {
    name = 'CartItemAdded1744360457788'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "serviceId" integer, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_84e765378a5f03ad9900df3a9ba" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_eab32bc09f2731f84d2e9a5dacc" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_eab32bc09f2731f84d2e9a5dacc"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_84e765378a5f03ad9900df3a9ba"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
    }
}
