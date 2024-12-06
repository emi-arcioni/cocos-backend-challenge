import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';

export class CreateTablesAndSeedData1732894232986
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      readFileSync('src/common/migrations/database.sql', 'utf8'),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS orders;`);
    await queryRunner.query(`DROP TABLE IF EXISTS marketdata;`);
    await queryRunner.query(`DROP TABLE IF EXISTS instruments;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TYPE IF EXISTS order_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS order_side;`);
    await queryRunner.query(`DROP TYPE IF EXISTS order_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS instrument_type;`);
  }
}
