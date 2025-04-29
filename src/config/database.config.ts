import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Parse database URL if available
function getDatabaseConfig(): TypeOrmModuleOptions {
  if (process.env.DATABASE_URL) {
    // Connection string format: postgresql://username:password@host:port/database
    const connectionString = process.env.DATABASE_URL;
    const match = connectionString.match(
      /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );

    if (match) {
      const [, username, password, host, port, database] = match;
      return {
        type: 'postgres',
        host,
        port: parseInt(port, 10),
        username,
        password,
        database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
        logging: true,
      };
    }
  }

  // Fall back to default config
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'db.bxoqdcntcejhcriwzzdt.supabase.co',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
  };
}

export const databaseConfig: TypeOrmModuleOptions = getDatabaseConfig();
