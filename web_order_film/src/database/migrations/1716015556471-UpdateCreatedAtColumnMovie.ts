import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCreatedAtColumnMovie1716015556471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE movies MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE movies ALTER COLUMN created_at DROP DEFAULT`,
    );
  }
}
