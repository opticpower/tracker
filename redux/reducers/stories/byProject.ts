import { AnyAction } from 'redux';

import { STORIES_BY_STATE } from '../../../constants';
import {
  ADD_STORIES,
  CLEAR_NEW_STORY,
  EDIT_STORY,
  MOVE_STORY,
  NEW_STORY,
  SAVED_NEW_STORY,
} from '../../actions/stories.actions';
import { Story } from '../../types';
import { StoriesByProject } from '../../types';

const initialState = {};

const reducer = (state: Record<string, StoriesByProject> = initialState, action: AnyAction) => {
  switch (action.type) {
    case NEW_STORY: {
      return {
        ...state,
        [action.projectId]: {
          storyIdsByState: {
            ...state[action.projectId].storyIdsByState,
            unscheduled: ['pending', ...state[action.projectId].storyIdsByState.unscheduled],
          },
        },
      };
    }
    case SAVED_NEW_STORY: {
      //clears the the story new story as well as adds a new story into state.
      const unscheduledStories = state[action.projectId].storyIdsByState.unscheduled.filter(
        id => id !== 'pending'
      );

      return {
        ...state,
        [action.projectId]: {
          storyIdsByState: {
            ...state[action.projectId].storyIdsByState,
            unscheduled: [action.story.id, ...unscheduledStories],
          },
        },
      };
    }
    case CLEAR_NEW_STORY: {
      return {
        ...state,
        [action.projectId]: {
          storyIdsByState: {
            ...state[action.projectId].storyIdsByState,
            unscheduled: [
              ...state[action.projectId].storyIdsByState.unscheduled.filter(id => id !== 'pending'),
            ],
          },
        },
      };
    }

    //todo: do all the addStories and stuff.
    case ADD_STORIES: {
      const storiesByState = action.stories.reduce(
        (stories: Record<string, string[]>, story: Story) => {
          return { ...stories, [story.current_state]: [...stories[story.current_state], story.id] };
        },
        STORIES_BY_STATE
      );

      return {
        ...state,
        [action.projectId]: {
          storyIdsByState: {
            ...storiesByState,
          },
        },
      };
    }
    case EDIT_STORY: {
      if (action.story.state !== action.oldStory.state) {
        //todo: the story has moved on the server, we should remove it from the previous bucket,
        //otherwise, the story is fine.
      }

      return state;
    }

    //     case MOVE_STORY: {
    //       const {
    //         projectId,
    //         sourceState,
    //         sourceIndex,
    //         destinationState,
    //         destinationIndex,
    //       } = action.payload;
    //       const story: Story = state[projectId][sourceState][sourceIndex];
    //       const sourceArr: Story[] = state[projectId][sourceState].filter(item => item.id !== story.id);

    //       if (sourceState === destinationState) {
    //         // If we are moving the story order in the same column, just reorganize the same array.
    //         return {
    //           ...state,
    //           [projectId]: {
    //             ...state[projectId],
    //             [sourceState]: [
    //               ...sourceArr.slice(0, destinationIndex),
    //               story,
    //               ...sourceArr.slice(destinationIndex),
    //             ],
    //           },
    //         };
    //       }
    //       const draggedArr: Story[] = state[projectId][destinationState];
    //       // If the story is dragged between columns, we need to adjust both states items.
    //       return {
    //         ...state,
    //         [projectId]: {
    //           ...state[projectId],
    //           [sourceState]: sourceArr,
    //           [destinationState]: [
    //             ...draggedArr.slice(0, destinationIndex),
    //             story,
    //             ...draggedArr.slice(destinationIndex),
    //           ],
    //         },
    //       };
    //     }
    //     default:
    //       return state;
  }
};

export default reducer;
