import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropColumnTypeSeat1720323557846 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE type_seat
         ADD COLUMN quantity INT`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE type_seat
        DROP COLUMN quantity
            `);
  }
}
