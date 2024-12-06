import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Load environment variables

const ormConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  logging: false,
};

// This will be used for migrations
export const AppDataSource = new DataSource(ormConfig);

// This will be used by NestJS
export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async () => ormConfig,
};
