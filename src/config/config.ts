export default () => ({
  db: {
    client: process.env.DATABASE_CLIENT || 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA,
    ssl: false,
  },
  etcd: {
    hosts: JSON.parse(process.env.ETCD_HOSTS),
    namespace: process.env.ETCD_NAMESPACE || 'featurist',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },
});
