import { Story } from '../types';
import { AnyAction } from 'redux';
import { ADD_STORIES, MOVE_STORY, EDIT_STORY } from '../actions/stories.actions';

const initialState = {};

const reducer = (
  state: Record<string, Record<string, Story[]>> = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case ADD_STORIES:
      return { ...state, [action.payload.id]: { ...action.payload.stories } };

    case EDIT_STORY: {
      const { projectId, story, storyState } = action.payload;
      const storyStateArr: Story[] = state[projectId][storyState];
      const storyIndex: number = storyStateArr.findIndex(element => element.id === story.id);
      const storiesArr: Story[] = [
        ...storyStateArr.slice(0, storyIndex),
        story,
        ...storyStateArr.slice(storyIndex + 1),
      ];
      return { ...state, [projectId]: { ...state[projectId], [storyState]: storiesArr } };
    }

    case MOVE_STORY: {
      const {
        projectId,
        sourceState,
        sourceIndex,
        destinationState,
        destinationIndex,
      } = action.payload;
      const story: Story = state[projectId][sourceState][sourceIndex];
      const sourceArr: Story[] = state[projectId][sourceState].filter(item => item.id !== story.id);

      if (sourceState === destinationState) {
        // If we are moving the story order in the same column, just reorganize the same array.
        return {
          ...state,
          [projectId]: {
            ...state[projectId],
            [sourceState]: [
              ...sourceArr.slice(0, destinationIndex),
              story,
              ...sourceArr.slice(destinationIndex),
            ],
          },
        };
      }
      const draggedArr: Story[] = state[projectId][destinationState];
      // If the story is dragged between columns, we need to adjust both states items.
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          [sourceState]: sourceArr,
          [destinationState]: [
            ...draggedArr.slice(0, destinationIndex),
            story,
            ...draggedArr.slice(destinationIndex),
          ],
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
