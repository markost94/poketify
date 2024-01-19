import { runQuery } from '@/db';
import { FastifyInstance, FastifyRequest } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/pokemons', async () => {
    const { rows } = await runQuery(fastify.pg, 'SELECT * from pokemon;');
    if (rows.length === 0) {
      throw new Error('There is no pokemon to show');
    }
    return rows;
  });

  fastify.post('/save-pokemon', async (req: FastifyRequest) => {
    return req.body;
  });
}
