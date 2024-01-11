import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { createORM } from './orm';

let orm: MikroORM<PostgreSqlDriver> | null = null;

export function getORM() {
  if (!orm) throw new Error('ORM not set');
  return orm;
}

export async function setupMikroORM() {
  console.info(`Connecting to postgres`);
  const mikro = await createORM(
    'postgres://elirium@localhost:5432/postgres',
    true,
  );

  if (conf.postgres.syncSchema) {
    const generator = mikro.getSchemaGenerator();
    try {
      await generator.updateSchema();
    } catch {
      try {
        await generator.clearDatabase();
        await generator.updateSchema();
      } catch {
        await generator.clearDatabase();
        await generator.dropSchema();
        await generator.updateSchema();
      }
    }
  }

  // if (conf.postgres.migrateOnBoot) {
  //   const migrator = mikro.getMigrator();
  //   await migrator.up();
  // }

  orm = mikro;
  console.info(`Connected to postgres - ORM is setup!`);
}
