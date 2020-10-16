import { State, Story } from '../types';

export const filterStories = (state: State, id: string, filters: any): Record<string, Story[]> => {
  let stories = state.stories[id];

  /** Filtering is AND based filtering **/
  for (const filter of Object.keys(filters)) {
    if (filter === 'iteration') {
      const selectedStories = filters[filter].stories.map((s: Story): string => s.id);
      const filteredStories = {};

      for (const status of Object.keys(stories)) {
        filteredStories[status] = stories[status].filter((story: Story): boolean =>
          selectedStories.includes(story.id)
        );
      }
      stories = { ...filteredStories };
      continue;
    }
    for (const label of filters[filter]) {
      const filteredStories = {};
      for (const status of Object.keys(stories)) {
        filteredStories[status] = stories[status].filter((story: Story): boolean => {
          for (const thisLabel of story[filter]) {
            if (thisLabel.id == label.id) {
              return true;
            }
          }
          return false;
        });
      }
      stories = { ...filteredStories };
    }
  }

  return stories;
};

// TODO: refactor redux state into normalized object mapped by ID to improve this perf
export const getStory = (state: State, projectId: string, storyId: string): Story => {
  return (
    state.stories[projectId] &&
    Object.values(state.stories[projectId])
      .flat()
      .find(story => String(story.id) === storyId)
  );
};
