import _ from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timeFormatter } from 'client/utils/timeFormatter';
import { useAppSelector } from 'client/utils/hooks';
import { getUsersForGameId } from 'client/views/results/resultsUtils';
import { getUpcomingGames } from 'client/utils/getUpcomingGames';
import { Button } from 'client/components/Button';
import { Game } from 'shared/typings/models/game';

export const DirectResults = (): ReactElement => {
  const { t } = useTranslation();

  const games = useAppSelector((state) => state.allGames.games);
  const signups = useAppSelector((state) => state.allGames.signups);
  const signupMessages = useAppSelector((state) => state.admin.signupMessages);

  const [showAllGames, setShowAllGames] = useState<boolean>(false);
  const [showSignupMessages, setShowSignupMessages] = useState<string[]>([]);

  const filteredGames = showAllGames ? games : getUpcomingGames(games, 1);

  const [gamesForListing, setGamesForListing] = useState<readonly Game[]>([]);
  const [filteredGamesForListing, setFilteredGamesForListing] = useState<{
    [key: string]: Game[];
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (_.isEqual(filteredGames, gamesForListing)) {
      return;
    }

    setGamesForListing(filteredGames);
  }, [filteredGames]);

  useEffect(() => {
    if (searchTerm.length === 0) {
      const gamesByStartTime = _.groupBy<Game>(gamesForListing, 'startTime');
      setFilteredGamesForListing(gamesByStartTime);
      return;
    }

    const gamesFilteredBySearchTerm = gamesForListing.filter((game) => {
      const users = getUsersForGameId(game.gameId, signups);
      return (
        game.title.toLocaleLowerCase().includes(searchTerm) ||
        users.some((user) =>
          user.username.toLocaleLowerCase().includes(searchTerm)
        )
      );
    });

    const gamesByStartTime = _.groupBy<Game>(
      gamesFilteredBySearchTerm,
      'startTime'
    );

    setFilteredGamesForListing(gamesByStartTime);
  }, [searchTerm, gamesForListing]);

  return (
    <div className='results-view'>
      <h2>{t('resultsView.allSignupResults')}</h2>

      <SearchInput
        type='text'
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder={t('findSignupOrGame')}
      />
      <div className='my-games-toggle-visibility'>
        <Button onClick={() => setShowAllGames(false)} disabled={!showAllGames}>
          {t('lastStartedAndUpcomingGames')}
        </Button>
        <Button onClick={() => setShowAllGames(true)} disabled={showAllGames}>
          {t('allGames')}
        </Button>
      </div>

      {filteredGames.length === 0 && (
        <h3>{t('resultsView.noStartingGames')}</h3>
      )}

      {Object.entries(filteredGamesForListing).map(
        ([startTime, gamesForTime]) => {
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
                  const signupMessage = signupMessages.find(
                    (message) => message.gameId === game.gameId
                  );
                  const signupMessagesVisible = showSignupMessages.find(
                    (message) => message === game.gameId
                  );
                  const users = getUsersForGameId(game.gameId, signups);

                  return (
                    <GameBox key={game.gameId}>
                      <h4 key={game.gameId}>
                        {`${game.title}`}{' '}
                        {!!signupMessage &&
                          (signupMessagesVisible ? (
                            <FontAwesomeIcon
                              icon={'comment'}
                              onClick={() =>
                                setShowSignupMessages(
                                  showSignupMessages.filter(
                                    (message) => message !== game.gameId
                                  )
                                )
                              }
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={['far', 'comment']}
                              onClick={() =>
                                setShowSignupMessages([
                                  ...showSignupMessages,
                                  game.gameId,
                                ])
                              }
                            />
                          ))}
                      </h4>

                      <PlayerCount>
                        {t('resultsView.players')}: {users.length}/
                        {game.maxAttendance}
                      </PlayerCount>

                      {signupMessagesVisible && (
                        <SignupMessageQuestion>
                          {signupMessage?.message}
                        </SignupMessageQuestion>
                      )}

                      <PlayerList>
                        {users.length === 0 ? (
                          <p>{t('resultsView.noSignups')}</p>
                        ) : (
                          users.map((user) => (
                            <p key={user.username}>
                              {user.username}
                              {signupMessagesVisible && (
                                <span>: {user.signupMessage}</span>
                              )}
                            </p>
                          ))
                        )}
                      </PlayerList>
                    </GameBox>
                  );
                })}
              </Games>
            </TimeSlot>
          );
        }
      )}
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

const SignupMessageQuestion = styled.p`
  font-weight: 600;
`;

const SearchInput = styled.input`
  border: 1px solid ${(props) => props.theme.borderInactive};
  color: ${(props) => props.theme.buttonText};
  height: 34px;
  padding: 0 0 0 10px;
  width: 100%;
`;
