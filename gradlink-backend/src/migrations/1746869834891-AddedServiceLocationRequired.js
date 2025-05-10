export class AddedServiceLocationRequired1746869834891 {
    name = 'AddedServiceLocationRequired1746869834891'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "location" SET NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "location" DROP NOT NULL`);
    }
}
