import { Story } from '../types';
import { AnyAction } from 'redux';

export const SELECT_STORY = 'SELECT_STORY';
export const DESELECT_STORY = 'DESELECT_STORY';

export const selectStory = (story: Story): AnyAction => ({
  type: SELECT_STORY,
  story,
});

export const deselectStory = (): AnyAction => ({
  type: DESELECT_STORY,
});
