import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { timeFormatter } from 'client/utils/timeFormatter';
import { Game } from 'shared/typings/models/game';
import { Button } from 'client/components/Button';
import { useAppDispatch, useAppSelector } from 'client/utils/hooks';
import { updateFavorite } from 'client/utils/favorite';

export interface Props {
  games: readonly Game[];
  startTimes: readonly string[];
}

export const GamesByStartTimes = ({
  games,
  startTimes,
}: Props): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.login.username);
  const favoritedGames = useAppSelector(
    (state) => state.myGames.favoritedGames
  );

  const removeFavorite = async (game: Game): Promise<void> => {
    await updateFavorite({
      game,
      action: 'del',
      favoritedGames,
      username,
      dispatch,
    });
  };

  const getGamesList = (startTime: string): Array<ReactElement | undefined> => {
    return games.map((game) => {
      if (game.startTime === startTime) {
        return (
          <GameDetailsList key={game.gameId}>
            <Link to={`/games/${game.gameId}`}>{game.title} </Link>
            <ButtonPlacement>
              <Button
                onClick={async () => {
                  await removeFavorite(game);
                }}
              >
                {' '}
                {t('button.removeFavorite')}{' '}
              </Button>
            </ButtonPlacement>
          </GameDetailsList>
        );
      }
    });
  };

  const startTimesList = startTimes.map((startTime) => {
    return (
      <div key={startTime}>
        <p className='bold'>
          {timeFormatter.getWeekdayAndTime({
            time: startTime,
            capitalize: true,
          })}
        </p>
        {getGamesList(startTime)}
      </div>
    );
  });

  return <div className='start-times-list'>{startTimesList}</div>;
};

const GameDetailsList = styled.p`
  padding-left: 30px;
`;

const ButtonPlacement = styled.span`
  padding-left: 10px;
`;
