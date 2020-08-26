import { State, Story } from '../types';

export const filterStories = (state: State, id: string, filters: {}): Record<string, Story[]> => {
  const stories = state.stories[id];
  const filteredStories = {};

  let filtered = false;

  /** Current filtering is Or Filering, but we should probably do And filtering */
  for (const filter of Object.keys(filters)) {
    if (filter === 'labels') {
      for (const label of filters[filter]) {
        filtered = true;
        for (const status of Object.keys(stories)) {
          filteredStories[status] = stories[status].filter((story: Story): boolean => {
            for (const thisLabel of story.labels) {
              if (thisLabel.id == label.id) {
                return true;
              }
            }
            return false;
          });
        }
      }
    }
  }

  return filtered ? filteredStories : stories;
};
