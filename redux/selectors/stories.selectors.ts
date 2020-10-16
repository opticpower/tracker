import { State, Story } from '../types';

export const filterStories = (
  state: State,
  projectId: string,
  filters: any //for now
): Record<string, Story[]> => {
  let storyIdsByState = state.stories.byProject[projectId]?.storyIdsByState;

  if (!storyIdsByState) {
    return null;
  }

  const byId = state.stories.byId;

  /** Filtering is AND based filtering **/
  for (const filter of Object.keys(filters)) {
    if (filter === 'iteration') {
      const selectedStories = filters[filter].stories.map((s: Story): string => s.id);
      const filteredStories = {};

      for (const state of Object.keys(storyIdsByState)) {
        filteredStories[state] = storyIdsByState[state].filter((storyId: string): boolean =>
          selectedStories.includes(storyId)
        );
      }
      storyIdsByState = { ...filteredStories };
      continue;
    }
    for (const label of filters[filter]) {
      const filteredStories = {};
      for (const status of Object.keys(storyIdsByState)) {
        filteredStories[status] = storyIdsByState[status].filter((storyId: string): boolean => {
          const story = byId[storyId];
          for (const thisLabel of story[filter]) {
            if (thisLabel.id == label.id) {
              return true;
            }
          }
          return false;
        });
      }
      storyIdsByState = { ...filteredStories };
    }
  }

  //now map all these stories.
  const stories = Object.keys(storyIdsByState).reduce((total, state) => {
    total[state] = storyIdsByState[state].map(
      (storyId: string): Story => {
        return byId[storyId];
      }
    );
    return total;
  }, {});

  return stories;
};
