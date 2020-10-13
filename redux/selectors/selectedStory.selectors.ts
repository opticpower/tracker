import { State, Story } from '../types';

export const getSelectedStory = (state: State): Story => {
  return state.selectedStory?.story;
};

export const isStorySelected = (state: State): boolean => {
  return state.selectedStory?.selected;
};
