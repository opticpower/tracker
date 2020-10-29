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

export const STORY_TYPES = ['feature', 'bug', 'chore', 'release'];

export const UNESTIMATED_STORY_TYPES = ['bug', 'chore'];

export const ESTIMATE_NOT_REQUIRED_STATES = ['unstarted', 'unscheduled'];

export const STORY_REVIEW_STATUS = ['unstarted', 'in_review', 'pass', 'revise'];

export const STORY_REVIEW_TYPES = {
  5793752: {
    type: 'Test (QA)',
  },
  5793753: {
    type: 'Design',
  },
  5793754: {
    type: 'Code',
  },
};
