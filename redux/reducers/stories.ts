import { AnyAction } from 'redux';

import {
  ADD_STORIES,
  CLEAR_NEW_STORY,
  EDIT_STORY,
  MOVE_STORY,
  NEW_STORY,
  SAVED_NEW_STORY,
} from '../actions/stories.actions';
import { StoriesState, Story } from '../types';
import byProjectReducer from './stories/byProject';

const initialState = {
  byId: {},
  byProject: {},
};

const reducer = (state: StoriesState = initialState, action: AnyAction) => {
  console.log('got action', action, state);
  const actionWithProjectId = { ...action, projectId: state.selectedProjectId };

  switch (action.type) {
    case NEW_STORY: {
      const pending = {
        id: 'pending',
        story_type: 'feature',
        comments: [],
        labels: [],
      };

      return {
        ...state,
        byId: {
          ...state.byId,
          pending,
        },
        //todo: I should probably slice this state out into its own reducer (byProject);
        byProject: byProjectReducer(state.byProject, actionWithProjectId),
      };
    }
    case SAVED_NEW_STORY: {
      //clears the the story new story as well as adds a new story into state.
      const { pending, ...byId } = state.byId;

      return {
        ...state,
        byId: {
          ...byId,
          [action.story.id]: action.story,
        },
        byProject: byProjectReducer(state.byProject, actionWithProjectId),
      };
    }
    case CLEAR_NEW_STORY: {
      //clears the the story new story from state as well as adds a new story into state.
      const { pending, ...byId } = state.byId;

      return {
        ...state,
        byId: {
          ...byId,
        },
        byProject: byProjectReducer(state.byProject, actionWithProjectId),
      };
    }

    case ADD_STORIES: {
      return {
        byId: {
          ...state.byId,
          ...action.stories.reduce((storiesById: Record<string, Story>, story: Story) => {
            storiesById[story.id] = story;
            return storiesById;
          }, {}),
        },
        byProject: byProjectReducer(state.byProject, action),
        selectedProjectId: action.projectId,
      };
    }
    case EDIT_STORY: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.story.id]: action.story,
        },
        byProject: byProjectReducer(state.byProject, {
          ...actionWithProjectId,
          oldStory: state.byId[action.story.id],
        }),
      };
    }

    case MOVE_STORY: {
      return {
        ...state,
        byProject: byProjectReducer(state.byProject, actionWithProjectId),
      };
    }
    default:
      return state;
  }
};

export default reducer;
