import { Config } from './typings/config.typings';

export const config: Config = {
  // App settings
  SIGNUP_END_TIME: 30, // minutes
  SIGNUP_OPEN_TIME: 4, // hours
  MESSAGE_DELAY: 3000, // ms

  // Convention settings
  CONVENTION_NAME: 'Ropecon' as const,
  CONVENTION_YEAR: '2021',
  CONVENTION_START_TIME: '2021-07-30T12:00:00Z', // UTC date
  DAY_START_TIME: 8, // 08:00
  noSignupGames: [],
  revolvingDoorEnabled: false,
  tagFilteringEnabled: true,
  simpleDetails: true,

  // Dev
  enableReduxTrace: false,
  enableAxe: false,
  enableWhyDidYouRender: false,

  // Environment dependent
  loadedSettings: process.env.SETTINGS ?? 'development',
  apiServerUrl: process.env.API_SERVER_URL ?? 'http://localhost:5000',
  useTestTime: process.env.USE_TEST_TIME === 'true' || false,
  dataUpdateInterval: Number(process.env.DATA_UPDATE_INTERVAL) ?? 60, // seconds
};
