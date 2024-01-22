import { runQuery } from '@/db';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface Pokemon {
  name: string;
  type: string;
  ability: string;
  height: string;
  weight: string;
  base_experience: number;
  captured: boolean;
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/pokemons', async () => {
    const { rows }: { rows: Pokemon[] } = await runQuery(
      fastify.pg,
      'SELECT * from pokemon;',
    );

    if (rows.length === 0) {
      throw new Error('There is no pokemon to show');
    }
    return rows;
  });

  fastify.post(
    '/save-pokemon',
    async (req: FastifyRequest, reply: FastifyReply) => {
      const {
        name,
        type,
        ability,
        height,
        weight,
        base_experience,
        captured,
      }: Pokemon = req.body as Pokemon;

      const result = await runQuery(
        fastify.pg,
        'INSERT INTO pokemon (name, type, ability, height, weight, base_experience, captured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [name, type, ability, height, weight, base_experience, captured],
      );
      reply.send({ success: true, id: result.id });
    },
  );
}
