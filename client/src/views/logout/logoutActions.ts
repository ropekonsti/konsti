import { clearSession } from 'client/utils/localStorage';
import {
  SubmitLogout,
  SUBMIT_LOGOUT,
} from 'client/typings/logoutActions.typings';

export const submitLogout = (): SubmitLogout => {
  clearSession();
  return {
    type: SUBMIT_LOGOUT,
  };
};
