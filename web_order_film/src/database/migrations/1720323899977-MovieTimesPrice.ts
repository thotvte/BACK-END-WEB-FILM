import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovieTimesPrice1720323899977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE movie_times_price(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    unit_price DECIMAL(10,2),
                    start_time DATETIME,
                    end_time DATETIME,
                    movie_id int,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL,
                    deleted_at DATETIME NULL,
                    status INT,
                    FOREIGN KEY (movie_id) REFERENCES movies(id)
                )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE movie_times_price `);
  }
}
