import Fastify, { FastifyInstance } from 'fastify';
import pg from '@fastify/postgres';
import { setupRoutes } from './routes';

export async function setupFastify(): Promise<FastifyInstance> {
  console.info(`setting up fastify...`);

  // create server
  const app = Fastify({
    logger: true,
  });

  // plugins
  console.info(`setting up plugins`);
  await app.register(pg, {
    connectionString: 'postgres://elirium@localhost:5432/postgres',
  });

  return app;
}

export function startFastify(app: FastifyInstance) {
  // listen to port
  console.info(`listening to port`);
  return new Promise<void>((resolve) => {
    app.listen(
      {
        port: 3000,
        host: '0.0.0.0',
      },
      function (err) {
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
    async (api, opts, done) => {
      setupRoutes(api);
      done();
    },
    {
      prefix: 'v1',
    },
  );
}
