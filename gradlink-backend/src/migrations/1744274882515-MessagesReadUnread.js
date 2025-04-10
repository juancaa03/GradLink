export class MessagesReadUnread1744274882515 {
    name = 'MessagesReadUnread1744274882515'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "messages" ADD "read" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read"`);
    }
}
