import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import { Array } from 'runtypes';
import { logger } from 'server/utils/logger';
import { GameRuntype } from 'shared/typings/models/game';
import { writeJson } from 'server/features/statistics/statsUtil';
import { FeedbackRuntype } from 'shared/typings/models/feedback';

export const formatFeedbacks = (year: number, event: string): void => {
  moment.locale('fi');

  const feedbacksJson = fs.readFileSync(
    `src/statistics/datafiles/${event}/${year}/secret/feedbacks.json`,
    'utf8'
  );
  const feedbacks = Array(FeedbackRuntype).check(JSON.parse(feedbacksJson));

  logger.info(`Loaded ${feedbacks.length} feedbacks`);

  const gamesJson = fs.readFileSync(
    `src/statistics/datafiles/${event}/${year}/games.json`,
    'utf8'
  );
  const games = Array(GameRuntype).check(JSON.parse(gamesJson));

  logger.info(`Loaded ${games.length} games`);

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => feedback.feedback !== ''
  );

  const formattedFeedbacks = filteredFeedbacks.map((feedback) => {
    const foundGame = games.find((game) => game.gameId === feedback.gameId);
    return {
      ...feedback,
      title: foundGame?.title,
      people: foundGame?.people,
      startTime: moment(foundGame?.startTime).format('dddd HH:mm'),
    };
  });

  const groupedFeedbacks = _.groupBy(formattedFeedbacks, 'people');

  writeJson(year, event, 'feedback', groupedFeedbacks);
};
