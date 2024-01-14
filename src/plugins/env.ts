import fastifyEnv from '@fastify/env';
import { FastifyInstance } from 'fastify';

export default async function envPlugin(fastify: FastifyInstance) {
  const schema = {
    type: 'object',
    required: ['PORT', 'HOST', 'POSTGRES_CONNECTION'],
    properties: {
      PORT: {
        type: 'number',
        default: 3000,
      },
      HOST: {
        type: 'string',
        default: '0.0.0.0',
      },
      POSTGRES_CONNECTION: {
        type: 'string',
        default: 'postgres://elirium@localhost:5432/postgres',
      },
    },
  };

  const options = {
    confKey: 'config',
    schema: schema,
    data: process.env,
    dotenv: true,
    removeAdditional: true,
  };

  fastify.register(fastifyEnv, options);
}
