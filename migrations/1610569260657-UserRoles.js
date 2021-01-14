/* eslint-disable @typescript-eslint/no-var-requires */
const { Table, TableColumn, TableForeignKey } = require('typeorm');

class UserRoles1610569260657 {
  name = 'UserRoles1610569260657';

  async up(queryRunner) {
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

    const { identifiers } = await queryRunner
      .manager
      .createQueryBuilder()
      .insert()
      .into('role', ['name', 'description'])
      .values([
          { name: 'admin', description: 'Administrator role' }
      ])
      .returning(['id'])
      .execute();

    await queryRunner.addColumn('user', new TableColumn({
      name: 'role_id',
      type: 'uuid',
      default: `'${identifiers[0].id}'`,
    }));

    await queryRunner.changeColumn('user', 'role_id', new TableColumn({
      name: 'role_id',
      type: 'uuid',
    }));

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
  }

  async down(queryRunner) {
    const table = await queryRunner.getTable('user');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
    await queryRunner.dropForeignKey('user', foreignKey);
    await queryRunner.dropColumn('user', 'role_id');
    await queryRunner.dropTable('role');
  }
}

module.exports = UserRoles1610569260657;
