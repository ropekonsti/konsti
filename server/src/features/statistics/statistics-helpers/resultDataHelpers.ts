import { logger } from 'server/utils/logger';
import { Game } from 'shared/typings/models/game';
import { ResultsCollectionEntry } from 'server/typings/result.typings';
import { StringNumberObject } from 'server/typings/common.typings';
import { toPercent } from 'server/features/statistics/statsUtil';

export const getSignupsByTime = (
  results: readonly ResultsCollectionEntry[]
): StringNumberObject => {
  const signupsByTime = results.reduce<StringNumberObject>((acc, result) => {
    acc[result.startTime] = result.results.length;
    return acc;
  }, {});

  /*
  logger.info(
    `Number of people entering to games by starting times: \n`,
    signupsByTime
  )
  */

  return signupsByTime;
};

export const getMaximumNumberOfPlayersByTime = (
  games: readonly Game[]
): StringNumberObject => {
  const maxNumberOfPlayersByTime: StringNumberObject = {};

  games.forEach((game) => {
    if (!maxNumberOfPlayersByTime[game.startTime]) {
      maxNumberOfPlayersByTime[game.startTime] = 0;
    }

    maxNumberOfPlayersByTime[game.startTime] =
      maxNumberOfPlayersByTime[game.startTime] + game.maxAttendance;
  });

  /*
  logger.info(
    `Maximum number of seats by starting times: \n`,
    maxNumberOfPlayersByTime
  )
  */
  return maxNumberOfPlayersByTime;
};

export const getDemandByTime = (
  signupsByTime: StringNumberObject,
  maximumNumberOfPlayersByTime: StringNumberObject
): void => {
  logger.info('Sanity check: values over 100% are anomalies');
  for (const startTime in maximumNumberOfPlayersByTime) {
    logger.info(
      `Signed people for ${startTime}: ${signupsByTime[startTime]}/${
        maximumNumberOfPlayersByTime[startTime]
      } (${toPercent(
        signupsByTime[startTime] / maximumNumberOfPlayersByTime[startTime]
      )}%)`
    );
  }
};
