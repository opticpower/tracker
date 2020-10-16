import { AnyAction } from 'redux';

import { Story } from '../types';

export const ADD_STORIES = 'ADD_STORIES';
export const MOVE_STORY = 'MOVE_STORY';
export const EDIT_STORY = 'EDIT_STORY';
export const NEW_STORY = 'NEW_STORY';
export const SAVED_NEW_STORY = 'SAVED_NEW_STORY';
export const CLEAR_NEW_STORY = 'CLEAR_NEW_STORY';

interface MoveStories {
  projectId: string;
  sourceState: string;
  sourceIndex: number;
  destinationState: string;
  destinationIndex: number;
}

export const newStory = (projectId: string): AnyAction => ({
  type: NEW_STORY,
  projectId,
});

export const savedNewStory = (projectId: string, story: Story): AnyAction => ({
  type: SAVED_NEW_STORY,
  projectId,
  story,
});

export const clearNewStory = (projectId: string): AnyAction => ({
  type: CLEAR_NEW_STORY,
  projectId,
});

export const addStories = (projectId: string, stories: Story[]): AnyAction => ({
  type: ADD_STORIES,
  projectId,
  stories,
});

export const editStory = (story: Story): AnyAction => ({
  type: EDIT_STORY,
  story,
});

export const moveStory = (payload: MoveStories): AnyAction => ({
  type: MOVE_STORY,
  payload,
});
