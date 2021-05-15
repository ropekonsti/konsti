import { postEnteredGame, postSignup } from 'client/services/signupServices';
import { AppThunk } from 'client/typings/utils.typings';
import {
  SubmitSignupAsync,
  SubmitSignupTime,
  SubmitSelectedGames,
  UpdateUnsavedChangesStatus,
  SUBMIT_SIGNUP_TIME,
  SUBMIT_SELECTED_GAMES,
  SUBMIT_ENTERED_GAMES,
  UPDATE_UNSAVED_CHANGES_STATUS,
  SUBMIT_SIGNED_GAMES,
  SubmitEnteredAsync,
} from 'client/typings/signupActions.typings';
import { SelectedGame } from 'shared/typings/models/user';
import { EnteredGameRequest, SignupData } from 'shared/typings/api/signup';
import { sharedConfig } from 'shared/config/sharedConfig';
import { SignupStrategy } from 'shared/config/sharedConfig.types';

const toEnteredGame = (signupData: SignupData): EnteredGameRequest => {
  return {
    username: signupData.username,
    enteredGameId: signupData.selectedGames[0].gameDetails.gameId,
    signupTime: signupData.signupTime,
  };
};

export const submitSignup = (signupData: SignupData): AppThunk => {
  return async (dispatch): Promise<void> => {
    if (sharedConfig.signupStrategy === SignupStrategy.DIRECT) {
      const enteredGame = toEnteredGame(signupData);
      const signupResponse = await postEnteredGame(enteredGame);

      if (signupResponse?.status === 'error') {
        return await Promise.reject(signupResponse);
      }

      if (signupResponse?.status === 'success') {
        const game = signupData.selectedGames.find(
          (game) => game.gameDetails.gameId === enteredGame.enteredGameId
        );
        if (game) {
          dispatch(submitEnteredGamesAsync(game));
        }
      }
    } else {
      const signupResponse = await postSignup(signupData);

      if (signupResponse?.status === 'error') {
        return await Promise.reject(signupResponse);
      }

      if (signupResponse?.status === 'success') {
        dispatch(submitSignupAsync(signupResponse.signedGames));
        dispatch(submitSelectedGames(signupResponse.signedGames));
      }
    }
  };
};

const submitSignupAsync = (
  signedGames: readonly SelectedGame[]
): SubmitSignupAsync => {
  return {
    type: SUBMIT_SIGNED_GAMES,
    signedGames,
  };
};

const submitEnteredGamesAsync = (
  enteredGame: SelectedGame
): SubmitEnteredAsync => {
  return {
    type: SUBMIT_ENTERED_GAMES,
    enteredGame,
  };
};

export const submitSignupTime = (signupTime: string): SubmitSignupTime => {
  return {
    type: SUBMIT_SIGNUP_TIME,
    signupTime,
  };
};

export const submitSelectedGames = (
  selectedGames: readonly SelectedGame[]
): SubmitSelectedGames => {
  return {
    type: SUBMIT_SELECTED_GAMES,
    selectedGames,
  };
};

export const updateUnsavedChangesStatus = (
  status: boolean
): UpdateUnsavedChangesStatus => {
  return {
    type: UPDATE_UNSAVED_CHANGES_STATUS,
    unsavedChanges: status,
  };
};
