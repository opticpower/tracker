import { Button, Card, Select, Text, User } from '@geist-ui/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { STORY_REVIEW_STATUS, STORY_REVIEW_TYPES } from '../constants';
import { getPeople } from '../redux/selectors/projects.selectors';
import { Review } from '../redux/types';

interface ReviewParams {
  reviews: Review[];
  currentState: any;
  storyId: number;
  updateStory: (state: any) => void;
}

const AddReviewContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  gap: 8px;
`;

const ReviewCard = styled.div`
  max-width: max-content;
  margin: 8px 0;
`;

const TypeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const SelectsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const DeleteButton = styled(Button)`
  align-self: flex-end;
`;

const Reviews = ({ reviews, storyId, currentState, updateStory }: ReviewParams): JSX.Element => {
  const [addingReview, setAddingReview] = useState(false);
  const people = useSelector(getPeople);

  const addReview = (reviewType: number) => {
    const { reviews } = currentState;
    const newReview = {
      id: Date.now(), // this is a temporal ID to identify review until save
      story_id: storyId,
      review_type_id: reviewType,
      reviewer_id: null,
      status: 'unstarted',
    };
    updateStory({ ...currentState, reviews: [...reviews, newReview] });
  };

  const deleteReview = (id: number) => {
    const withRemovedReview = currentState.reviews.filter(r => r.id !== id);
    updateStory({ ...currentState, reviews: withRemovedReview });
  };

  const setReviewer = (reviewId: number, reviewerId: string) => {
    const withUpdatedReview = currentState.reviews.map(review =>
      review.id === reviewId ? { ...review, reviewer_id: Number(reviewerId) } : review
    );
    updateStory({ ...currentState, reviews: withUpdatedReview });
  };

  const setReviewStatus = (reviewId: number, status: string) => {
    const withUpdatedReview = currentState.reviews.map(review =>
      review.id === reviewId ? { ...review, status } : review
    );
    updateStory({ ...currentState, reviews: withUpdatedReview });
  };

  const handleReviewAdd = (id: number) => {
    addReview(id);
    setAddingReview(false);
  };

  const AddButtons = () => {
    return (
      <>
        {Object.entries(STORY_REVIEW_TYPES).map(o => (
          <Button key={o[0]} size="small" onClick={() => handleReviewAdd(Number(o[0]))}>
            {o[1].type}
          </Button>
        ))}
      </>
    );
  };

  return (
    <>
      <AddReviewContainer>
        {addingReview ? (
          <AddButtons />
        ) : (
          <Button auto size="small" onClick={() => setAddingReview(true)}>
            Add review
          </Button>
        )}
      </AddReviewContainer>

      {reviews.map(
        (rev: Review): JSX.Element => (
          <ReviewCard key={rev.id}>
            <Card>
              <TypeContainer>
                <Text span>{STORY_REVIEW_TYPES[rev.review_type_id].type}</Text>

                <DeleteButton
                  auto
                  ghost
                  size="mini"
                  type="error"
                  onClick={() => deleteReview(rev.id)}>
                  Delete
                </DeleteButton>
              </TypeContainer>

              <SelectsContainer>
                <Text span small>
                  Reviewer:
                </Text>
                <Select
                  placeholder="Reviewer"
                  value={rev.reviewer_id && String(rev.reviewer_id)}
                  size="small"
                  onChange={reviewerId => setReviewer(rev.id, reviewerId)}>
                  {people.map(owner => (
                    <Select.Option key={owner.id} value={String(owner.id)}>
                      {owner.name}
                    </Select.Option>
                  ))}
                </Select>

                <Text span small>
                  Status:
                </Text>
                <Select
                  placeholder="Status"
                  value={rev.status}
                  size="small"
                  onChange={status => setReviewStatus(rev.id, status)}>
                  {STORY_REVIEW_STATUS.map(type => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </SelectsContainer>
            </Card>
          </ReviewCard>
        )
      )}
    </>
  );
};

export default Reviews;
