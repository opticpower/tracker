import { AnyAction } from 'redux';

import { DESELECT_STORY, SELECT_STORY } from '../actions/selectedStory.actions';
import { SAVED_NEW_STORY } from '../actions/stories.actions';
import { SelectedStory } from '../types';

const initalState = {
  selected: false,
};

const reducer = (state: SelectedStory = initalState, action: AnyAction): SelectedStory => {
  switch (action.type) {
    case SELECT_STORY:
      return { selected: true, storyId: action.story.id };
    case DESELECT_STORY: {
      return { selected: false };
    }
    case SAVED_NEW_STORY: {
      //** If the modal was open for pending and it was updated to a saved state, update to that storyId */
      if (state.selected && state.storyId === 'pending') {
        return { selected: true, storyId: action.story.id };
      }
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
