class IntitialSchema1603182614700 {
  name = 'IntitialSchema1603182614700'

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE "${process.env.DB_SCHEMA}"."feature" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(150) NOT NULL,
        "description" text NOT NULL,
        "application_id" uuid NOT NULL,
        CONSTRAINT "UQ_3c58fcd583d23ca1f20949b5a5c" UNIQUE ("name"),
        CONSTRAINT "PK_7ee173ef61740b68f78d78055e2" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f6794dafa3f88630ace50b2d90" ON "${process.env.DB_SCHEMA}"."feature" ("id", "application_id") `);

    await queryRunner.query(`
      CREATE TABLE "${process.env.DB_SCHEMA}"."application" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(150) NOT NULL,
        "description" text NOT NULL,
        CONSTRAINT "PK_26cdd74486e9e1191ead669ac7a" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "${process.env.DB_SCHEMA}"."user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "username" character varying(150) NOT NULL,
        "password" character varying NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_b67337b7f8aa8406e936c2ff754" UNIQUE ("username"),
        CONSTRAINT "PK_03b91d2b8321aa7ba32257dc321" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`ALTER TABLE "${process.env.DB_SCHEMA}"."feature" ADD CONSTRAINT "FK_ac91e8c619bdc21fd603683f584" FOREIGN KEY ("application_id") REFERENCES "${process.env.DB_SCHEMA}"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await queryRunner.query(`
      INSERT INTO "${process.env.DB_SCHEMA}"."user" (username, password)
      VALUES ('admin', '$2b$10$ET/B2cGu4nNfaQ1GJDmFgeBO3eawl3L5LeXW9ainufnAMu528eIB2')
    `);
  }

  async down(queryRunner) {
      await queryRunner.query(`ALTER TABLE "${process.env.DB_SCHEMA}"."feature" DROP CONSTRAINT "FK_ac91e8c619bdc21fd603683f584"`);
      await queryRunner.query(`DROP TABLE "${process.env.DB_SCHEMA}"."user"`);
      await queryRunner.query(`DROP TABLE "${process.env.DB_SCHEMA}"."application"`);
      await queryRunner.query(`DROP INDEX "${process.env.DB_SCHEMA}"."IDX_f6794dafa3f88630ace50b2d90"`);
      await queryRunner.query(`DROP TABLE "${process.env.DB_SCHEMA}"."feature"`);
  }
}

module.exports = IntitialSchema1603182614700;
