import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleUp as fasAngleUp,
  faAngleDown as fasAngleDown,
  faEye as fasEye,
  faEyeSlash as fasEyeSlash,
  faHeart as fasHeart,
  faBars as fasBars,
  faTimes as fasTimes,
  faComment as fasComment,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as farHeart,
  faComment as farComment,
} from '@fortawesome/free-regular-svg-icons';

export const getIconLibrary = (): void => {
  library.add(
    fasAngleUp,
    fasAngleDown,
    fasEye,
    fasEyeSlash,
    fasHeart,
    farHeart,
    fasBars,
    fasTimes,
    farComment,
    fasComment
  );
};
