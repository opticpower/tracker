import { Story } from '../redux/types';

export const getStoryPayload = (
  stories: Story[],
  destinationState: string,
  landingIndex: number
): { current_state?: string; before_id?: number; after_id?: number } => {
  if (destinationState === 'accepted') {
    return { current_state: destinationState };
  }

  return {
    current_state: destinationState,
    // A null before_id means the story was placed first in the list.
    before_id: stories[destinationState][landingIndex]?.id || null,
    // A null after_id means the story was placed last in the list.
    after_id: stories[destinationState][landingIndex - 1]?.id || null,
  };
};
