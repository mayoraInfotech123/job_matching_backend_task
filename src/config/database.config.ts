import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@db.bxoqdcntcejhcriwzzdt.supabase.co:5432/postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Set to false in production
  ssl: {
    rejectUnauthorized: false, // Needed for connecting to Supabase from Railway
  },
  logging: true,
};
