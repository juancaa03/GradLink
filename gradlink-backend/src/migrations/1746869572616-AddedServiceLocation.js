export class AddedServiceLocation1746869572616 {
    name = 'AddedServiceLocation1746869572616'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "services" ADD "location" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "location"`);
    }
}
