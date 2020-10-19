import { State, Story } from '../types';

export const getSelectedStory = (state: State): Story => {
  return state.stories.byId[state.selectedStory?.storyId];
};

export const isStorySelected = (state: State): boolean => {
  return state.selectedStory?.selected;
};
