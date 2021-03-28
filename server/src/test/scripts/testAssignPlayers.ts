import 'array-flat-polyfill';
import moment from 'moment';
import { logger } from 'server/utils/logger';
import { runAssignment } from 'server/player-assignment/runAssignment';
import { config } from 'server/config';
import { saveResults } from 'server/player-assignment/utils/saveResults';
import { removeOverlapSignups } from 'server/player-assignment/utils/removeOverlapSignups';
import { verifyUserSignups } from 'server/player-assignment/test/utils/verifyUserSignups';
import { verifyResults } from 'server/player-assignment/test/utils/verifyResults';
import { AssignmentStrategy } from 'server/typings/config.typings';
import { db } from 'server/db/mongodb';

const testAssignPlayers = async (
  assignmentStrategy: AssignmentStrategy
): Promise<void> => {
  const {
    CONVENTION_START_TIME,
    saveTestAssign,
    enableRemoveOverlapSignups,
  } = config;

  let assignResults;

  const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

  try {
    assignResults = await runAssignment(startingTime, assignmentStrategy);
  } catch (error) {
    logger.error(error);
    return;
  }

  if (saveTestAssign) {
    if (enableRemoveOverlapSignups) {
      try {
        await removeOverlapSignups(assignResults.results);
      } catch (error) {
        logger.error(error);
        return;
      }
    }

    try {
      await saveResults(
        assignResults.results,
        startingTime,
        assignResults.algorithm,
        assignResults.message
      );
    } catch (error) {
      logger.error(error);
      return;
    }

    await verifyResults();

    await verifyUserSignups();
  }
};

const getAssignmentStrategy = (userParameter: string): AssignmentStrategy => {
  if (
    userParameter === AssignmentStrategy.munkres ||
    userParameter === AssignmentStrategy.group ||
    userParameter === AssignmentStrategy.padg ||
    userParameter === AssignmentStrategy.groupPadg
  ) {
    return userParameter;
  } else {
    throw new Error(
      'Give valid strategy parameter, possible: "munkres", "group", "padg", "group+padg"'
    );
  }
};

const init = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    logger.error(`Player allocation not allowed in production`);
    return;
  }

  const userParameter = process.argv[2];

  let assignmentStrategy;
  try {
    assignmentStrategy = getAssignmentStrategy(userParameter);
  } catch (error) {
    logger.error(error);
    return;
  }

  try {
    await db.connectToDb();
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }

  await testAssignPlayers(assignmentStrategy);

  try {
    await db.gracefulExit();
  } catch (error) {
    logger.error(error);
  }
};

init().catch((error) => {
  logger.error(error);
});
