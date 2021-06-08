import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Server } from 'http';
import { startServer } from 'server/utils/startServer';
import { closeServer } from 'server/utils/closeServer';
import { GAMES_ENDPOINT } from 'shared/constants/apiEndpoints';

let server: Server;
let mongoServer: MongoMemoryServer;
let mongoUri: string;

beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  mongoUri = await mongoServer.getUri();
  server = await startServer(mongoUri);
});

afterEach(async () => {
  await closeServer(server);
  await mongoServer.stop();
});

test(`GET ${GAMES_ENDPOINT} should return 200`, async () => {
  const response = await request(server).get(GAMES_ENDPOINT);
  expect(response.status).toEqual(200);
});

test(`POST ${GAMES_ENDPOINT} should return 401 without valid authorization`, async () => {
  const response = await request(server).post(GAMES_ENDPOINT);
  expect(response.status).toEqual(401);
});
