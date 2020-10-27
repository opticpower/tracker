import { subDays } from 'date-fns';

import { STORY_STATES } from '../constants';
import { Project, Story, User } from '../redux/types';

const PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5';

const STORY_FIELDS =
  'fields=name,estimate,owners,labels,blockers,reviews,story_type,description,comments(id,person,text,created_at),current_state';

class PivotalHandler {
  static async getUser({ apiKey }): Promise<User> {
    const response = await fetch(`${PIVOTAL_API_URL}/me?fields=name,id,initials,email`, {
      headers: {
        'X-TrackerToken': apiKey,
      },
    });

    return await response.json();
  }

  // Gets all projects for the provided user apiKey.
  static async fetchProjects({ apiKey }): Promise<Project[]> {
    const response = await fetch(
      'https://www.pivotaltracker.com/services/v5/projects?fields=id,name,memberships',
      {
        headers: {
          'X-TrackerToken': apiKey,
        },
      }
    );

    return await response.json();
  }

  // Gets all project stories for the provided user apiKey.
  static async fetchProjectStories({ apiKey, projectId }): Promise<Story[]> {
    //todo: change to one request using GET-REquest Aggrigator (https://www.pivotaltracker.com/help/api/#Using_the_GET_Request_Aggregator)
    const stories = await Promise.all(
      STORY_STATES.map(
        async (state: string): Promise<Story[]> => {
          let fetchString = `stories?limit=500&with_state=${state}&${STORY_FIELDS}`;
          if (state === 'accepted') {
            const oneWeekAgo = subDays(new Date(), 7);
            fetchString = `${fetchString}&accepted_after=${oneWeekAgo.getTime()}`;
          }

          const request = await fetch(`${PIVOTAL_API_URL}/projects/${projectId}/${fetchString}`, {
            headers: {
              'X-TrackerToken': apiKey,
            },
          });
          return request.json();
        }
      )
    );

    return stories.flat();
  }

  // Updates a single story.
  static async updateStory({ apiKey, projectId, storyId, payload }): Promise<Story> {
    if (storyId === 'pending') {
      const response = await fetch(
        `${PIVOTAL_API_URL}/projects/${projectId}/stories?${STORY_FIELDS}`,
        {
          method: 'POST',
          headers: {
            'X-TrackerToken': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...payload }),
        }
      );
      return response.json();
    }

    const response = await fetch(
      `${PIVOTAL_API_URL}/projects/${projectId}/stories/${storyId}?${STORY_FIELDS}`,
      {
        method: 'PUT',
        headers: {
          'X-TrackerToken': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload }),
      }
    );
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
