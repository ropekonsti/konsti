import { Game } from 'shared/typings/models/game';

export interface Settings {
  hiddenGames: readonly Game[];
  signupTime: string;
  appOpen: boolean;
  signupMessages: SignupMessage[];
}

export interface SignupMessage {
  gameId: string;
  message: string;
}
