import { Story } from '../types';
import { AnyAction } from 'redux';

export const ADD_STORIES = 'ADD_STORIES';
export const MOVE_STORY = 'MOVE_STORY';

interface AddStories {
  id: string;
  stories: Record<string, Story[]>;
}

interface Movetories {
  projectId: string;
  sourceState: string;
  sourceIndex: number;
  destinationState: string;
  destinationIndex: number;
}

export const addStories = (payload: AddStories): AnyAction => ({
  type: ADD_STORIES,
  payload,
});

export const moveStory = (payload: Movetories): AnyAction => ({
  type: MOVE_STORY,
  payload,
});
