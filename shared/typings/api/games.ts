import { Game } from 'shared/typings/models/game';

export interface PostGamesResponse {
  message: string;
  status: 'success';
  games: Game[];
}

export interface GetGamesResponse {
  message: string;
  status: 'success';
  games: GameWithUsernames[];
}

export interface GameWithUsernames {
  game: Game;
  users: UserSignup[];
}

export interface UserSignup {
  username: string;
  signupMessage: string;
}
