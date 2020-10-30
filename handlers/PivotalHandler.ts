import { subDays } from 'date-fns';

import { STORY_STATES } from '../constants';
import { Project, Review, Story, User } from '../redux/types';

const PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5';

const STORY_FIELDS =
  'fields=name,estimate,owners,labels,blockers,reviews,story_type,description,comments(id,person,text,created_at),current_state';

interface ProjectCredentials {
  apiKey: string;
  projectId: string;
}

interface ReviewsChanges {
  added: Review[];
  deleted: Review[];
  changed: Review[];
}

interface ReviewActionParams extends ProjectCredentials {
  review: Review;
}

interface ReviewHandlerParams extends ProjectCredentials {
  reviewsChanges: ReviewsChanges;
}

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

  // Create a single review
  static async createReview({ apiKey, projectId, review }: ReviewActionParams): Promise<void> {
    // We should delete id and reviewer_id to meet API requirements
    delete review.id;
    if (review.reviewer_id === null) {
      delete review.reviewer_id;
    }

    const response = await fetch(
      `${PIVOTAL_API_URL}/projects/${projectId}/stories/${review.story_id}/reviews`,
      {
        method: 'POST',
        headers: {
          'X-TrackerToken': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...review, project_id: projectId }),
      }
    );
    return response.json();
  }

  // Updates a single review
  static async updateReview({ apiKey, projectId, review }: ReviewActionParams): Promise<void> {
    const response = await fetch(
      `${PIVOTAL_API_URL}/projects/${projectId}/stories/${review.story_id}/reviews/${review.id}`,
      {
        method: 'PUT',
        headers: {
          'X-TrackerToken': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...review, project_id: projectId }),
      }
    );
    return response.json();
  }

  // Deletes a single review
  static async deleteReview({ apiKey, projectId, review }: ReviewActionParams): Promise<void> {
    const response = await fetch(
      `${PIVOTAL_API_URL}/projects/${projectId}/stories/${review.story_id}/reviews/${review.id}`,
      {
        method: 'DELETE',
        headers: {
          'X-TrackerToken': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story_id: review.story_id, project_id: projectId }),
      }
    );
    return response.json();
  }

  static async reviews({ apiKey, projectId, reviewsChanges }: ReviewHandlerParams): Promise<any> {
    return await Promise.all(
      [
        reviewsChanges.added.map(review =>
          PivotalHandler.createReview({ apiKey, projectId, review })
        ),
        reviewsChanges.deleted.map(review =>
          PivotalHandler.deleteReview({ apiKey, projectId, review })
        ),
        reviewsChanges.changed.map(review =>
          PivotalHandler.updateReview({ apiKey, projectId, review })
        ),
      ].flat()
    );
  }
}
export default PivotalHandler;
