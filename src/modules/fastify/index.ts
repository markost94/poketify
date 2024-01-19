import Fastify, { FastifyInstance } from 'fastify';
import { setupRoutes } from './routes';
import envPlugin from '@/plugins/env';
import { fastifyPostgres } from '@fastify/postgres';

export async function setupFastify(): Promise<FastifyInstance> {
  console.info(`setting up fastify...`);

  // create server
  const app = Fastify({
    logger: true,
  });

  // plugins
  await app.register(envPlugin);
  await app.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_CONNECTION,
  });
  return app;
}

export function startFastify(app: FastifyInstance) {
  // listen to port
  console.info(`listening to port`);
  return new Promise<void>((resolve) => {
    app.listen(
      {
        port: Number(process.env.PORT) || 3000,
        host: process.env.HOST || '0.0.0.0',
      },
      (err) => {
        if (err) {
          app.log.error(err);
          console.error(`Failed to setup fastify`);
          process.exit(1);
        }
        console.info(`fastify setup successfully`);
        resolve();
      },
    );
  });
}

export async function setupFastifyRoutes(app: FastifyInstance) {
  console.info(`setting up routes`);
  await app.register(
    async (api, _, done) => {
      setupRoutes(api);
      done();
    },
    {
      prefix: process.env.API_PREFIX,
    },
  );
}
