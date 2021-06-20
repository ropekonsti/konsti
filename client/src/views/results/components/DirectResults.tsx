import _ from 'lodash';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { timeFormatter } from 'client/utils/timeFormatter';
import { useAppSelector } from 'client/utils/hooks';
import { getUsernamesForGameId } from 'client/views/results/resultsUtils';
import { getUpcomingGames } from 'client/utils/getUpcomingGames';
import { Button } from 'client/components/Button';

export const DirectResults = (): ReactElement => {
  const { t } = useTranslation();

  const games = useAppSelector((state) => state.allGames.games);
  const signups = useAppSelector((state) => state.allGames.signups);

  const [showAllGames, setShowAllGames] = useState<boolean>(false);
  const filteredGames = showAllGames ? games : getUpcomingGames(games, 1);
  const gamesByStartTime = _.groupBy(filteredGames, 'startTime');

  return (
    <div className='results-view'>
      <h2>{t('resultsView.allSignupResults')}</h2>

      <div className='my-games-toggle-visibility'>
        <Button onClick={() => setShowAllGames(false)} disabled={!showAllGames}>
          {t('lastStartedAndUpcomingGames')}
        </Button>
        <Button onClick={() => setShowAllGames(true)} disabled={showAllGames}>
          {t('allGames')}
        </Button>
      </div>

      {Object.entries(gamesByStartTime).map(([startTime, gamesForTime]) => {
        return (
          <TimeSlot key={startTime}>
            <h3>
              {timeFormatter.getWeekdayAndTime({
                time: startTime,
                capitalize: true,
              })}
            </h3>

            <Games>
              {gamesForTime.map((game) => {
                const usernames = getUsernamesForGameId(game.gameId, signups);
                return (
                  <GameBox key={game.gameId}>
                    <h4 key={game.gameId}>{`${game.title}`}</h4>
                    <PlayerCount>
                      {t('resultsView.players')}: {usernames.length}/
                      {game.maxAttendance}
                    </PlayerCount>
                    <PlayerList>
                      {usernames.length > 0 ? (
                        usernames.map((username) => (
                          <p key={username}>{username}</p>
                        ))
                      ) : (
                        <p>{t('resultsView.noSignups')}</p>
                      )}
                    </PlayerList>
                  </GameBox>
                );
              })}
            </Games>
          </TimeSlot>
        );
      })}
    </div>
  );
};

const TimeSlot = styled.div`
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 1px 8px 15px 0 rgba(0, 0, 0, 0.42);
  margin: 0 0 24px 0;
  padding: 0 10px 20px 10px;
`;

const Games = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 0 0 30px;
  justify-content: space-between;
`;

const GameBox = styled.div`
  flex-basis: 25%;
  flex-grow: 0;
  padding: 0 20px 10px 20px;
  min-width: 200px;
`;

const PlayerList = styled.div`
  padding: 0 0 0 30px;
`;

const PlayerCount = styled.div`
  padding: 0 0 0 10px;
`;
