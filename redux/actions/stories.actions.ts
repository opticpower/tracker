import { Story } from '../types';
import { AnyAction } from 'redux';

export const ADD_STORIES = 'ADD_STORIES';

interface AddStories {
  id: string;
  stories: Record<string, Story[]>;
}

export const addStories = (payload: AddStories): AnyAction => ({
  type: ADD_STORIES,
  payload,
});
