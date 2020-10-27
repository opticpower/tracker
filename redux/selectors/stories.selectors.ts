import { State, Story, StoryModes } from '../types';

export const getSelectedProjectId = (state: State): string => {
  return state.stories.selectedProjectId;
};

export const getSelectedProjectMode = (state: State): string => {
  return state.stories.byProject[state.stories.selectedProjectId]?.selectedMode;
};

export const filterStories = (
  state: State,
  projectId: string,
  filters: any //for now
): Record<string, Story[]> => {
  const mode = state.stories.byProject[projectId]?.selectedMode;

  let storyIdsByMode =
    mode === 'Milestone'
      ? state.stories.byProject[projectId]?.storyIdsByMilestone
      : state.stories.byProject[projectId]?.storyIdsByState;

  if (!storyIdsByMode) {
    return null;
  }

  const byId = state.stories.byId;

  /** Filtering is AND based filtering **/
  for (const filter of Object.keys(filters)) {
    if (filter === 'iteration') {
      const selectedStories = filters[filter].stories.map((s: Story): string => s.id);
      const filteredStories = {};

      for (const mode of Object.keys(storyIdsByMode)) {
        filteredStories[mode] = storyIdsByMode[mode].filter((storyId: string): boolean =>
          selectedStories.includes(storyId)
        );
      }
      storyIdsByMode = { ...filteredStories };
      continue;
    }
    for (const label of filters[filter]) {
      const filteredStories = {};
      for (const mode of Object.keys(storyIdsByMode)) {
        filteredStories[mode] = storyIdsByMode[mode].filter((storyId: string): boolean => {
          const story = byId[storyId];
          for (const thisLabel of story[filter]) {
            if (thisLabel.id == label.id) {
              return true;
            }
          }
          return false;
        });
      }
      storyIdsByMode = { ...filteredStories };
    }
  }

  //now map all these stories.
  const stories = Object.keys(storyIdsByMode).reduce(
    (total, state) => ({
      ...total,
      [state]: storyIdsByMode[state].map((storyId: string): Story => byId[storyId]),
    }),
    {}
  );

  return stories;
};
