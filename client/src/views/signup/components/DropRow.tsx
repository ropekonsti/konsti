import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Game } from 'shared/typings/models/game';

export interface Props {
  droppableId: string;
  games: readonly Game[];
  label: string;
  showCount: boolean;
}

export const DropRow = ({
  droppableId,
  games,
  label,
  showCount,
}: Props): ReactElement => {
  const { t } = useTranslation();

  const getListStyle = (dragging: boolean): string => {
    if (dragging) return 'dragging';
    else return '';
  };

  const getPopularity = (game: Game): string => {
    if (game.popularity >= game.maxAttendance) return 'high-popularity';
    else if (
      game.popularity >= game.maxAttendance / 2 &&
      game.popularity >= game.minAttendance
    )
      return 'medium-popularity';
    else return 'low-popularity';
  };

  return (
    <>
      <p>
        {label} {showCount && <span>({games.length}/3)</span>}
      </p>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <DropRowContainer
            className={`drop-row ${droppableId} ${getListStyle(
              snapshot.isDraggingOver
            )}`}
            ref={provided.innerRef}
          >
            {games.map((game, index) => (
              <Draggable
                key={game.gameId}
                draggableId={game.gameId}
                index={index}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
                {(provided) => (
                  <Link to={`/games/${game.gameId}`}>
                    <DraggableItem
                      className={`${getPopularity(game)}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SignupGameTitle className='break-long'>
                        {game.title}
                      </SignupGameTitle>
                      <SignupShortDescription className='break-long'>
                        {t(`programType.${game.programType}`)}:{' '}
                        {game.shortDescription
                          ? game.shortDescription
                          : game.gameSystem}
                      </SignupShortDescription>
                      <SignupPopularity>
                        {t('playerStatus')}: {t(getPopularity(game))}
                      </SignupPopularity>
                    </DraggableItem>
                  </Link>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </DropRowContainer>
        )}
      </Droppable>
    </>
  );
};

const DropRowContainer = styled.div`
  background: ${(props) => props.theme.backgroundHighlight};
  min-height: 40px;
  padding: 10px;

  &.dragging {
    background: ${(props) => props.theme.backgroundDndRow};
  }

  &.availableGames,
  &.selectedGames {
    min-height: 500px;
  }

  a {
    color: ${(props) => props.theme.mainText};
    text-decoration: none;
    cursor: grabbing;
  }
`;

const DraggableItem = styled.div`
  background: ${(props) => props.theme.backgroundDndItem};
  border: 1px solid ${(props) => props.theme.borderInactive};
  margin: 8px 0;
  padding: 8px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  border-radius: 3px;

  :hover,
  :focus {
    filter: brightness(90%);
  }

  &.high-popularity {
    background: #ffe8e8;
  }

  &.medium-popularity {
    background: #fff;
  }

  &.low-popularity {
    background: #f0ffff;
  }
`;

const SignupGameTitle = styled.p`
  margin: 0 0 4px 0;
`;

const SignupShortDescription = styled.p`
  margin: 0 0 0 14px;
  font-size: ${(props) => props.theme.fontSizeSmall};
  font-style: italic;

  @media (max-width: ${(props) => props.theme.breakpointPhone}) {
    margin: 0;
  }
`;

const SignupPopularity = styled.p`
  font-size: ${(props) => props.theme.fontSizeSmall};
  margin-bottom: 0;
`;
