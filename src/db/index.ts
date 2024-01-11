import { PostgresDb } from '@fastify/postgres';

export const RESET_DB = `DROP TABLE IF EXISTS pokemon;

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  ability VARCHAR(100),
  height DECIMAL(4,2),
  weight DECIMAL(5,2),
  base_experience INTEGER,
  captured BOOLEAN DEFAULT FALSE
);
`;

export async function resetDb(pg: PostgresDb) {
  await runQuery(pg, RESET_DB);
  return 'Ok';
}

export async function runQuery(
  pg: PostgresDb,
  query: string,
  params: unknown[] = [],
) {
  const client = await pg.connect();
  try {
    return await client.query(query, params);
  } finally {
    client.release();
  }
}
