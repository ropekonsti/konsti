export enum GameUpdateMethod {
  signups = 'signups',
  assign = 'assign',
}

export interface Config {
  port: number;
  debug: boolean;
  logDir: string;
  enableAccessLog: boolean;
  dbConnString: string;
  dbName: string;
  jwtSecretKey: string;
  jwtSecretKeyAdmin: string;
  allowedCorsOrigins: readonly string[];
  dataUri: string;
  GROUP_ASSIGNMENT_ROUNDS: number;
  PADG_ASSIGNMENT_ROUNDS: number;
  RANDOM_ASSIGNMENT_ROUNDS: number;
  bundleCompression: boolean;
  autoUpdateGamesEnabled: boolean;
  gameUpdateInterval: number;
  CONVENTION_START_TIME: string;
  enableRemoveOverlapSignups: boolean;
  saveTestAssign: boolean;
  autoUpdateGamePopularityEnabled: boolean;
  gamePopularityUpdateMethod: GameUpdateMethod;
  updateGamePopularityEnabled: boolean;
  useLocalProgramFile: boolean;
  autoAssignPlayersEnabled: boolean;
  enableSignupTimeCheck: boolean;
  firtSignupBonus: number;
}
