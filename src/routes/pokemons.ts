import { runQuery } from '@/db';
import { FastifyInstance } from 'fastify';

const getAllPokemons = 'SELECT * from pokemon;';

export default async function (fastify: FastifyInstance) {
  fastify.get('/pokemons', async () => {
    const { rows } = await runQuery(fastify.pg, getAllPokemons);
    return rows;
  });
}
