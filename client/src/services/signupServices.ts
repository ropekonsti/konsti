import { AxiosResponse, AxiosError } from 'axios';
import { api } from 'client/utils/api';
import { ServerError } from 'shared/typings/api/errors';
import {
  ENTERED_GAME_ENDPOINT,
  SIGNUP_ENDPOINT,
} from 'shared/constants/apiEndpoints';
import {
  EnteredGameRequest,
  PostSignupResponse,
  PostEnteredGameResponse,
  SignupData,
} from 'shared/typings/api/signup';

export const postSignup = async (
  signupData: SignupData
): Promise<PostSignupResponse | ServerError> => {
  let response: AxiosResponse;
  try {
    response = await api.post<PostSignupResponse>(SIGNUP_ENDPOINT, {
      signupData,
    });
  } catch (error) {
    if (error?.response) {
      const axiosError: AxiosError<ServerError> = error;
      if (axiosError.response) return axiosError.response.data;
    }
    throw error;
  }

  return response.data;
};

export const postEnteredGame = async (
  enteredGameRequest: EnteredGameRequest
): Promise<PostEnteredGameResponse | ServerError> => {
  let response: AxiosResponse;
  try {
    response = await api.post<PostEnteredGameResponse>(
      ENTERED_GAME_ENDPOINT,
      enteredGameRequest
    );
  } catch (error) {
    if (error?.response) {
      const axiosError: AxiosError<ServerError> = error;
      if (axiosError.response) return axiosError.response.data;
    }
    throw error;
  }

  return response.data;
};
