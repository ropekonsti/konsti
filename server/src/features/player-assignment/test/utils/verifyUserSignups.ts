import moment from 'moment';
import { logger } from 'server/utils/logger';
import { User } from 'server/typings/user.typings';
import { findUsers } from 'server/features/user/userRepository';

export const verifyUserSignups = async (): Promise<void> => {
  logger.info('Verify entered games and signups match for users');

  let users: User[];
  try {
    users = await findUsers();
  } catch (error) {
    logger.error(error);
    return;
  }

  users.map((user) => {
    // Group member enteredGames match with group leader signedGames
    let groupLeader: User | undefined;
    if (user.groupCode !== '0' && user.groupCode !== user.serial) {
      groupLeader = users.find((leader) => leader.serial === user.groupCode);
    }

    user.enteredGames.map((enteredGame) => {
      const userToMatch = groupLeader ?? user;
      const gameFound = userToMatch.signedGames.find(
        (signedGame) =>
          signedGame.gameDetails.gameId === enteredGame.gameDetails.gameId &&
          moment(signedGame.gameDetails.startTime).isSame(
            enteredGame.gameDetails.startTime
          )
      );

      if (gameFound) {
        logger.info(
          `Signup found: "${user.username}" - "${enteredGame.gameDetails.title}"`
        );
      }

      if (!gameFound) {
        logger.error(
          `Signup not found: "${user.username}" - "${enteredGame.gameDetails.title}"`
        );
      }
    });
  });
};
