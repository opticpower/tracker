import { Story } from '../types';
import { AnyAction } from 'redux';

export const ADD_STORIES = 'ADD_STORIES';
export const MOVE_STORY = 'MOVE_STORY';
export const EDIT_STORY = 'EDIT_STORY';

interface AddStories {
  id: string;
  stories: Record<string, Story[]>;
}

interface EditStory {
  projectId: string;
  storyState: string;
  story: Story;
}

interface MoveStories {
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

export const editStory = (payload: EditStory): AnyAction => ({
  type: EDIT_STORY,
  payload,
});

export const moveStory = (payload: MoveStories): AnyAction => ({
  type: MOVE_STORY,
  payload,
});
