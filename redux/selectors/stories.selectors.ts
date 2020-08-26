import { State, Story } from '../types';

export const filterStories = (state: State, id: string, filters: {}): Record<string, Story[]> => {
  let stories = state.stories[id];

  /** Filtering is AND based filtering **/
  for (const filter of Object.keys(filters)) {
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
