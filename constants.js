export const STORY_STATES = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];

export const STORIES_BY_STATE = STORY_STATES.reduce((acc, state) => ({ ...acc, [state]: [] }), {});
