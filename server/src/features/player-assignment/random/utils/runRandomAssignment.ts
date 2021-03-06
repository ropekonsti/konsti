import { eventAssignment } from 'eventassigner-random';
import { CheckResult } from 'eventassigner-random/lib/typings/checkResult';
import { config } from 'server/config';
import { getGroups } from 'server/features/player-assignment/utils/getGroups';
import { getList } from 'server/features/player-assignment/utils/getList';
import { getRandomAssignEvents } from 'server/features/player-assignment/random/utils/getRandomAssignEvents';
import { formatResults } from 'server/features/player-assignment/utils/formatResults';
import { Game } from 'shared/typings/models/game';
import { AssignmentStrategyResult } from 'server/typings/result.typings';
import {
  ListItem,
  RandomAssignUpdateLInput,
  PadgRandomAssignResults,
} from 'server/typings/padgRandomAssign.typings';
import { User } from 'shared/typings/models/user';

export const runRandomAssignment = (
  signedGames: readonly Game[],
  playerGroups: readonly User[][],
  startingTime: string
): AssignmentStrategyResult => {
  const groups = getGroups(playerGroups, startingTime);
  const events = getRandomAssignEvents(signedGames);
  const list = getList(playerGroups, startingTime);
  const updateL = (input: RandomAssignUpdateLInput): ListItem[] => input.L;

  const { RANDOM_ASSIGNMENT_ROUNDS } = config;
  const input = {
    groups,
    events,
    L: list,
    updateL,
    assignmentRounds: RANDOM_ASSIGNMENT_ROUNDS,
  };

  const assignResults = eventAssignment(input);

  if (isCheckResult(assignResults)) {
    throw new Error(`Random assignment error: ${assignResults.msg}`);
  }

  const results = formatResults(assignResults, playerGroups);

  const message = 'Random assignment completed';

  return { results, message };
};

const isCheckResult = (
  assignResults: PadgRandomAssignResults | CheckResult
): assignResults is CheckResult => {
  return (assignResults as CheckResult).value !== undefined;
};
