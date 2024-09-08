import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnProducts1720319761653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE products
     ADD COLUMN image NVARCHAR(200)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE products
    DROP COLUMN image
        `);
  }
}
