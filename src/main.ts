import {
  setupFastify,
  setupFastifyRoutes,
  startFastify,
} from '@/modules/fastify';

async function bootstrap(): Promise<void> {
  console.info(`App booting...`);

  const app = await setupFastify();

  await setupFastifyRoutes(app);
  await startFastify(app);

  console.info(`App setup, ready to accept connections`);
  console.info(`--------------------------------------`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
