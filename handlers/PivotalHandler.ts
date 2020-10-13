import { subDays } from 'date-fns';

export const STORY_STATES = ['unscheduled', 'unstarted', 'started', 'finished', 'delivered', 'rejected', 'accepted'];
const PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5';

class PivotalHandler {
  // Gets all projects for the provided user apiKey.
  async fetchProjects({ apiKey }) {
    const response = await fetch('https://www.pivotaltracker.com/services/v5/projects', {
      headers: {
        'X-TrackerToken': apiKey,
      },
    });

    return await response.json();
  }

  // Gets all project stories for the provided user apiKey.
  async fetchProjectStories({ apiKey, projectId }) {
    const stories = await Promise.all(
      STORY_STATES.map(async state => {
        let fetchString = `stories?limit=500&with_state=${state}&fields=name,estimate,owners,labels,blockers,reviews,story_type`;
        if (state === 'Accepted') {
          const oneWeekAgo = subDays(new Date(), 7);
          fetchString = `${fetchString}&accepted_after=${oneWeekAgo.getTime()}`;
        }

        const request = await fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/${fetchString}`, {
          headers: {
            'X-TrackerToken': apiKey,
          },
        });
        return { [state]: await request.json() };
      })
    );
    const normalizedStories = stories.reduce((acc, stateObject) => ({ ...acc, ...stateObject }), {});

    return normalizedStories;
  }

  // Updates a single story.
  async updateStory({ apiKey, projectId, storyId, payload }) {
    await fetch(`${PIVOTAL_API_URL}/projects/${projectId}/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'X-TrackerToken': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload }),
    });
  }
}
export default PivotalHandler;
