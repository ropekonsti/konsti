import { Server } from 'http';
import { db } from 'server/db/mongodb';
import { logger } from 'server/utils/logger';

export const closeServer = async (
  server: Server | null,
  dbConnString: string
): Promise<void> => {
  try {
    await db.gracefulExit(dbConnString);
    server && (await server.close());
  } catch (error) {
    logger.error(error);
  }

  logger.info('Server closed');
};
