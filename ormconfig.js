require('dotenv').config();

module.exports = {
  type: process.env.DATABASE_CLIENT || 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  ssl: false,
  migrationsTableName: 'feature_toggle_migration',
  migrations: ['migrations/*.js'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
};
