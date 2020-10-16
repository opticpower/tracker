export const STORY_STATES = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];

//anyone know a nifty way to convert the above array into the bottom structure?
export const STORIES_BY_STATE = {
  unscheduled: [],
  unstarted: [],
  started: [],
  finished: [],
  delivered: [],
  rejected: [],
  accepted: [],
};
