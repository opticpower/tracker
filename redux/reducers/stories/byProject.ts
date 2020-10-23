import { AnyAction } from 'redux';

import { STORIES_BY_MILESTONE, STORIES_BY_STATE, STORY_MILESTONES } from '../../../constants';
import {
  ADD_STORIES,
  CLEAR_NEW_STORY,
  EDIT_STORY,
  MOVE_STORY,
  NEW_STORY,
  SAVED_NEW_STORY,
  TOGGLE_MODE,
} from '../../actions/stories.actions';
import { Story, StoryModes } from '../../types';
import { StoriesByProject } from '../../types';

const initialState = {};

const getStoryMilestone = (story: Story): string => {
  const labels = story.labels.map(label => label.name.toLowerCase());

  for (const milestoneName of STORY_MILESTONES) {
    if (labels.includes(milestoneName)) {
      return milestoneName;
    }
  }

  return 'backlog';
};

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

    case ADD_STORIES: {
      const storiesByState = action.stories.reduce(
        (stories: Record<string, string[]>, story: Story) => {
          return { ...stories, [story.current_state]: [...stories[story.current_state], story.id] };
        },
        STORIES_BY_STATE
      );

      const storiesByMilestone = action.stories.reduce(
        (stories: Record<string, string[]>, story: Story) => {
          //get current story milestone:
          const milestone = getStoryMilestone(story);

          return { ...stories, [milestone]: [...stories[milestone], story.id] };
        },
        STORIES_BY_MILESTONE
      );

      return {
        ...state,
        [action.projectId]: {
          ...(state[action.projectId] || { selectedMode: StoryModes.State }),
          storyIdsByState: {
            ...storiesByState,
          },
          storyIdsByMilestone: {
            ...storiesByMilestone,
          },
        },
      };
    }
    case EDIT_STORY: {
      //   if (action.story.state !== action.oldStory.state) {
      //     //todo: the story has moved on the server, we should remove it from the previous bucket,
      //     //otherwise, the story is fine.
      //   }

      return state;
    }

    case MOVE_STORY: {
      const { projectId, sourceState, sourceIndex, destinationState, destinationIndex } = action;
      const storyId: string = state[projectId].storyIdsByState[sourceState][sourceIndex];
      const sourceWithoutStory: string[] = state[projectId].storyIdsByState[sourceState].filter(
        (id: string): boolean => id !== storyId
      );

      if (sourceState === destinationState) {
        // If we are moving the story order in the same column, just reorganize the same array.
        return {
          ...state,
          [projectId]: {
            ...state[projectId],
            storyIdsByState: {
              ...state[projectId].storyIdsByState,
              [sourceState]: [
                ...sourceWithoutStory.slice(0, destinationIndex),
                storyId,
                ...sourceWithoutStory.slice(destinationIndex),
              ],
            },
          },
        };
      }
      const destinationStateList: string[] = state[projectId].storyIdsByState[destinationState];
      // If the story is dragged between columns, we need to adjust both states items.
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          storyIdsByState: {
            ...state[projectId].storyIdsByState,
            [sourceState]: sourceWithoutStory,
            [destinationState]: [
              ...destinationStateList.slice(0, destinationIndex),
              storyId,
              ...destinationStateList.slice(destinationIndex),
            ],
          },
        },
      };
    }
    case TOGGLE_MODE: {
      const { mode, projectId } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          selectedMode: mode,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
