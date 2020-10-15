import { AnyAction } from 'redux';

import { DESELECT_STORY, SELECT_STORY } from '../actions/selectedStory.actions';
import { EDIT_STORY } from '../actions/stories.actions';
import { SelectedStory } from '../types';

const initalState = {
  selected: false,
};

const reducer = (state: SelectedStory = initalState, action: AnyAction): SelectedStory => {
  switch (action.type) {
    case SELECT_STORY:
      return { selected: true, story: action.story };
    case DESELECT_STORY: {
      return { selected: false };
    }
    case EDIT_STORY: {
      if (action.payload.story.id === state?.story?.id) {
        return { ...state, story: action.payload.story };
      }
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
