import jsonwebtoken from 'jsonwebtoken';
import { config } from 'server/config';
import { JWTResult } from 'server/typings/jwt.typings';
import { UserGroup } from 'shared/typings/models/user';

export const getJWT = (userGroup: UserGroup, username: string): string => {
  const payload = {
    username,
    userGroup,
  };

  const options = {
    expiresIn: '14 days',
  };

  return jsonwebtoken.sign(payload, getSecret(userGroup), options);
};

export const verifyJWT = (
  jwt: string,
  userGroup: UserGroup,
  username: string
): JWTResult => {
  try {
    const result = jsonwebtoken.verify(jwt, getSecret(userGroup)) as JWTResult;

    if (typeof result !== 'string' && result.username === username)
      return {
        username: result.username,
        userGroup: result.userGroup,
        iat: result.iat,
        exp: result.exp,
        status: 'success',
        message: 'success',
      };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        status: 'error',
        message: 'expired jwt',
        username: '',
        userGroup: '',
        iat: 0,
        exp: 0,
      };
    }
  }

  return {
    status: 'error',
    message: 'unknown jwt error',
    username: '',
    userGroup: '',
    iat: 0,
    exp: 0,
  };
};

export const decodeJWT = (jwt: string): JWTResult => {
  return jsonwebtoken.decode(jwt) as JWTResult;
};

const getSecret = (userGroup: UserGroup): string => {
  if (userGroup === 'admin') {
    return config.jwtSecretKeyAdmin;
  } else if (userGroup === 'user') {
    return config.jwtSecretKey;
  } else if (userGroup === 'help') {
    return config.jwtSecretKey;
  }
  return '';
};
