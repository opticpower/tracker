import { Story } from '../types';
import { AnyAction } from 'redux';
import { ADD_STORIES } from '../actions/stories.actions';

const initialState = {};

const reducer = (state: Record<string, Record<string, Story>> = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_STORIES:
      return { ...state, [action.payload.id]: { ...action.payload.stories } };
    default:
      return state;
  }
};

export default reducer;
