import { subDays } from 'date-fns';

import { Project, Story } from '../redux/types';

export const STORY_STATES = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];
const PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5';

const STORY_FIELDS =
  'fields=name,estimate,owners,labels,blockers,reviews,story_type,description,comments(id,person,text,created_at),current_state';

class PivotalHandler {
  // Gets all projects for the provided user apiKey.
  static async fetchProjects({ apiKey }): Promise<Project[]> {
    const response = await fetch('https://www.pivotaltracker.com/services/v5/projects', {
      headers: {
        'X-TrackerToken': apiKey,
      },
    });

    return await response.json();
  }

  // Gets all project stories for the provided user apiKey.
  static async fetchProjectStories({ apiKey, projectId }): Promise<Record<string, Story[]>> {
    const stories = await Promise.all(
      STORY_STATES.map(async state => {
        let fetchString = `stories?limit=500&with_state=${state}&${STORY_FIELDS}`;
        if (state === 'Accepted') {
          const oneWeekAgo = subDays(new Date(), 7);
          fetchString = `${fetchString}&accepted_after=${oneWeekAgo.getTime()}`;
        }

        const request = await fetch(
          `https://www.pivotaltracker.com/services/v5/projects/${projectId}/${fetchString}`,
          {
            headers: {
              'X-TrackerToken': apiKey,
            },
          }
        );
        return { [state]: await request.json() };
      })
    );
    const normalizedStories = stories.reduce(
      (acc, stateObject) => ({ ...acc, ...stateObject }),
      {}
    );

    return normalizedStories;
  }

  // Updates a single story.
  static async updateStory({ apiKey, projectId, storyId, payload }): Promise<Story> {
    if (!storyId) {
      const response = await fetch(`${PIVOTAL_API_URL}/projects/${projectId}/stories`, {
        method: 'POST',
        headers: {
          'X-TrackerToken': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload }),
      });
      return response.json();
    }

    const response = await fetch(`${PIVOTAL_API_URL}/projects/${projectId}/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'X-TrackerToken': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload }),
    });
    return response.json();
  }

  /** Fetches a single story */
  static async fetchStory({ apiKey, projectId, storyId }): Promise<Story> {
    const response = await fetch(
      `${PIVOTAL_API_URL}/projects/${projectId}/stories/${storyId}?${STORY_FIELDS}`,
      {
        method: 'GET',
        headers: {
          'X-TrackerToken': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.json();
  }

  static async addComment({ apiKey, projectId, storyId, text }): Promise<void> {
    await fetch(`${PIVOTAL_API_URL}/projects/${projectId}/stories/${storyId}/comments`, {
      method: 'POST',
      headers: {
        'X-TrackerToken': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
  }
}
export default PivotalHandler;
