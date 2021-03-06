import { Request, Response } from 'express';
import { isAuthorized } from 'server/utils/authHeader';
import { UserGroup } from 'shared/typings/models/user';
import { storeFeedback } from 'server/features/feedback/feedbackService';
import { logger } from 'server/utils/logger';
import { FEEDBACK_ENDPOINT } from 'shared/constants/apiEndpoints';
import { Feedback, FeedbackRuntype } from 'shared/typings/models/feedback';

export const postFeedback = async (
  req: Request<{}, {}, Feedback>,
  res: Response
): Promise<Response> => {
  logger.info(`API call: POST ${FEEDBACK_ENDPOINT}`);

  let parameters;
  try {
    parameters = FeedbackRuntype.check(req.body);
  } catch (error) {
    return res.sendStatus(422);
  }

  if (
    !isAuthorized(
      req.headers.authorization,
      UserGroup.USER,
      parameters.username
    )
  ) {
    return res.sendStatus(401);
  }

  const response = await storeFeedback(parameters);
  return res.json(response);
};
