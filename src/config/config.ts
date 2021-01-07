export default () => ({
  db: {
    client: process.env.DB_CLIENT || 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA,
    ssl: false,
  },
  etcd: {
    host: process.env.ETCD_HOST,
    port: parseInt(process.env.ETCD_PORT, 10),
    namespace: process.env.ETCD_NAMESPACE || 'featurist',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },
});
