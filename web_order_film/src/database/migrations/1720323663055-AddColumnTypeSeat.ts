import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnTypeSeat1720323663055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE type_seat
             ADD COLUMN unit_price DECIMAL(10,2)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE type_seat
            DROP COLUMN unit_price
                `);
  }
}
