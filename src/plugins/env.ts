import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env';
import fastifyPlugin from 'fastify-plugin';

const configPlugin: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  options: unknown,
  done: (error?: Error) => void,
) => {
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
      },
    },
  };

  const configOptions: FastifyEnvOptions = {
    confKey: 'config',
    schema: schema,
    data: process.env,
    dotenv: true,
  };

  return fastifyEnv(fastify, configOptions, done);
};

export default fastifyPlugin(configPlugin);
