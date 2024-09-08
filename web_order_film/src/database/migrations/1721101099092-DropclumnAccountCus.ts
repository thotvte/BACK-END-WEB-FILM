import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropclumnAccountCus1721101099092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE account_cus
            DROP COLUMN confirm_password
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE account_cus
            ADD COLUMN confirm_password NVARCHAR(50)`);
  }
}
