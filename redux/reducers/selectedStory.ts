import { SelectedStory, Story } from '../types';
import { AnyAction } from 'redux';
import { DESELECT_STORY, SELECT_STORY } from '../actions/selectedStory.actions';

const initalState = {
  selected: false,
};

const reducer = (state: SelectedStory = initalState, action: AnyAction) => {
  switch (action.type) {
    case SELECT_STORY:
      return { selected: true, story: action.story };
    case DESELECT_STORY: {
      return { selected: false };
    }
    default:
      return state;
  }
};

export default reducer;
