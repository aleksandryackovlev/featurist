/* eslint-disable @typescript-eslint/no-var-requires */
const { Table, TableForeignKey, TableIndex } = require('typeorm');

class IntitialSchema1603182614700 {
  name = 'IntitialSchema1603182614700'

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.createTable(
      new Table({
        name: 'feature',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: 150,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'is_enabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'application_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('feature', new TableIndex({
      columnNames: ['id', 'application_id'],
      isUnique: true,
    }));

    await queryRunner.createTable(
      new Table({
        name: 'application',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: 150,
          },
          {
            name: 'description',
            type: 'text',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: 150,
          },
          {
            name: 'description',
            type: 'text',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: 150,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'role_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'application_users_user',
        columns: [
          {
            name: 'application_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'permission',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'action',
            type: 'varchar',
            length: 150,
          },
          {
            name: 'subject',
            type: 'varchar',
            length: 150,
          },
          {
            name: 'is_allowed',
            type: 'boolean',
          },
          {
            name: 'role_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'feature',
      new TableForeignKey({
        columnNames: ['application_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'application',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'application_users_user',
      new TableForeignKey({
        columnNames: ['application_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'application',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'application_users_user',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createPrimaryKey('application_users_user', ['application_id', 'user_id']);
    await queryRunner.createIndex("application_users_user", new TableIndex({ columnNames: ['application_id'] }));
    await queryRunner.createIndex("application_users_user", new TableIndex({ columnNames: ['user_id'] }));

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'permission',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  async down(queryRunner) {
    const featureTable = await queryRunner.getTable('feature');
    const featureForeignKey = featureTable.foreignKeys.find(fk => fk.columnNames.indexOf('application_id') !== -1);
    const featureIndex = featureTable.indices.find(index => index.columnNames.indexOf('application_id') !== -1);

    const userTable = await queryRunner.getTable('user');
    const userForeignKey = userTable.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);

    const permissionTable = await queryRunner.getTable('permission');
    const permissionForeignKey = permissionTable.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);

    const applicaionUsersTable = await queryRunner.getTable('application_users_user');
    const applicaionUsersApplicationIdForeignKey = applicaionUsersTable.foreignKeys.find(fk => fk.columnNames.indexOf('application_id') !== -1);
    const applicaionUsersUserIdForeignKey = applicaionUsersTable.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    const applicaionUsersApplicationIdIndex = applicaionUsersTable.indices.find(index => index.columnNames.indexOf('application_id') !== -1);
    const applicaionUsersUserIdIndex = applicaionUsersTable.indices.find(index => index.columnNames.indexOf('user_id') !== -1);

    await queryRunner.dropForeignKey('user', userForeignKey);
    await queryRunner.dropForeignKey('permission', permissionForeignKey);
    await queryRunner.dropForeignKey('feature', featureForeignKey);
    await queryRunner.dropIndex('feature', featureIndex);
    await queryRunner.dropForeignKey('application_users_user', applicaionUsersApplicationIdForeignKey);
    await queryRunner.dropForeignKey('application_users_user', applicaionUsersUserIdForeignKey);
    await queryRunner.dropIndex('application_users_user', applicaionUsersApplicationIdIndex);
    await queryRunner.dropIndex('application_users_user', applicaionUsersUserIdIndex);

    await queryRunner.dropTable('application');
    await queryRunner.dropTable('feature');
    await queryRunner.dropTable('role');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('permission');
    await queryRunner.dropTable('application_users_user');
  }
}

module.exports = IntitialSchema1603182614700;
