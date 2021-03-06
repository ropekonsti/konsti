import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { timeFormatter } from 'client/utils/timeFormatter';
import { Game } from 'shared/typings/models/game';

export interface Props {
  hiddenGames: readonly Game[];
}

export const HiddenGamesList = ({ hiddenGames }: Props): ReactElement => {
  const { t } = useTranslation();

  const sortedGames = _.sortBy(hiddenGames, [
    (hiddenGame) => hiddenGame.title.toLowerCase(),
  ]);

  return (
    <div className='hidden'>
      <h3>{t('hiddenGames')}</h3>

      <ul>
        {hiddenGames.length === 0 && <span>{t('noHiddenGames')}</span>}

        {sortedGames.map((game) => (
          <li key={game.gameId}>
            <Link to={`/games/${game.gameId}`}>{game.title}</Link>

            {' - '}

            {timeFormatter.getWeekdayAndTime({
              time: game.startTime,
              capitalize: false,
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};
