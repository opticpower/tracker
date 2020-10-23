export const STORY_STATES = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];

export const STORY_MILESTONES = ['backlog', 'milestone 1', 'milestone 2', 'milestone 3'];

export const STORIES_BY_STATE = STORY_STATES.reduce((acc, state) => ({ ...acc, [state]: [] }), {});

export const STORIES_BY_MILESTONE = STORY_MILESTONES.reduce(
  (acc, state) => ({ ...acc, [state]: [] }),
  {}
);

export const UNESTIMATED_STORY_TYPES = ['bug', 'chore'];

export const ESTIMATE_NOT_REQUIRED_STATES = ['unstarted', 'unscheduled'];
