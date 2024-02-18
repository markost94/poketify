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

const getOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            type: { type: 'string' },
            ability: { type: 'string' },
            height: { type: 'number' },
            weight: { type: 'number' },
            base_experience: { type: 'number' },
            captured: { type: 'boolean' },
          },
        },
      },
    },
  },
};

const postOpts = {
  schema: {
    body: {
      type: 'object',
      required: [
        'name',
        'type',
        'ability',
        'height',
        'weight',
        'base_experience',
        'captured',
      ],
    },
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
  },
};

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/pokemons',
    getOpts,
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { rows }: { rows: Pokemon[] } = await runQuery(
          fastify.pg,
          'SELECT * from pokemon;',
        );
        if (rows.length === 0) {
          return reply.status(404).send('There is no pokemon to show');
        }
        return reply.status(200).send(rows);
      } catch (error) {
        console.log(error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );

  fastify.post(
    '/save-pokemon',
    postOpts,
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

      try {
        await runQuery(
          fastify.pg,
          'INSERT INTO pokemon (name, type, ability, height, weight, base_experience, captured) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [name, type, ability, height, weight, base_experience, captured],
        );
        return reply.status(201).send({
          success: true,
          message: 'Saved new Pokemon',
        });
      } catch (error) {
        return reply.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
    },
  );

  fastify.put(
    '/update-pokemon/:id',
    postOpts,
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = req.params as { id: number };
        const {
          name,
          type,
          ability,
          height,
          weight,
          base_experience,
          captured,
        }: Pokemon = req.body as Pokemon;

        await runQuery(
          fastify.pg,
          'UPDATE pokemon SET name = $2, type = $3, ability = $4, height = $5, weight = $6, base_experience = $7, captured = $8 WHERE id = $1',
          [id, name, type, ability, height, weight, base_experience, captured],
        );
        return reply.status(201).send({
          success: true,
          message: `${name} updated`,
        });
      } catch (error) {
        return reply.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
    },
  );
}
