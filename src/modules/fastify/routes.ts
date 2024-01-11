import pokemons from '@/routes/pokemons';
import root from '@/routes/root';
import { FastifyInstance } from 'fastify';

export async function setupRoutes(app: FastifyInstance) {
  await app.register(root);
  await app.register(pokemons);
}
