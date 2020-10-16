import { AnyAction } from 'redux';

import { DESELECT_STORY, SELECT_STORY } from '../actions/selectedStory.actions';
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
    default:
      return state;
  }
};

export default reducer;
