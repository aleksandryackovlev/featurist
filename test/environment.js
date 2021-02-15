/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { fixturesIterator, Loader, Resolver } = require('typeorm-fixtures-cli/dist');
const {
  ConnectionOptionsReader,
  getConnectionManager,
  getRepository,
} = require('typeorm');
const NodeEnvironment = require('jest-environment-node');
const request = require('supertest');

const typeOrmConfigPath = 'ormconfig.js';

const loadEntities = async () => {
  try {
    const options = await new ConnectionOptionsReader({
      root: path.resolve(__dirname, '../'),
      configName: path.basename(
        typeOrmConfigPath,
        path.extname(typeOrmConfigPath),
      ),
    }).get('default');

    if (!global.connection) {
      global.connection = await getConnectionManager()
        .create(options.default ? options.default : options)
        .connect();
    }

    const unique = (array) => Array.from(new Set(array));

    const loader = new Loader();
    loader.load(path.resolve(__dirname, '../fixtures/entities'));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const entities = {};
    let entityNames = [];

    for (const fixture of fixturesIterator(fixtures)) {
      entityNames = unique([...entityNames, fixture.entity]);
    }

    for (const entity of entityNames) {
      entities[`${entity.toLowerCase()}s`] = JSON.parse(JSON.stringify(await getRepository(entity).find({
        relations: getRepository(entity).metadata.relations.map(({propertyName}) => propertyName)
      })));
    }

    if (global.connection) {
      await global.connection.close();
      global.connection = null;
    }

    return entities;
  } catch (err) {
    if (global.connection) {
      await global.connection.close();
      global.connection = null;
    }

    throw err;
  }
};

class Environment extends NodeEnvironment {
  async setup() {
    if (!global.entities) {
      global.entities = await loadEntities();
    }

    if (!global.app) {
      global.app = request('http://localhost:3000/admin/v1');
    }

    if (!global.credentials) {
      const [admin, developer, restrictedUser] = await Promise.all([
        global.app
          .post('/auth/login')
          .send({ username: 'admin', password: 'test' }),
        global.app
          .post('/auth/login')
          .send({ username: 'developer', password: 'test' }),
        global.app
          .post('/auth/login')
          .send({ username: 'manager', password: 'test' }),
      ]);

      global.credentials = {
        adminToken: admin.body.data.access_token,
        restrictedUserToken: restrictedUser.body.data.access_token,
        developerToken: developer.body.data.access_token,
      };
    }

    this.global.entities = global.entities;
    this.global.app = global.app;
    this.global.credentials = global.credentials;

    await super.setup();
  }
}

module.exports = Environment;
