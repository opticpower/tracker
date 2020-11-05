import { Button, Card, Modal, Select, Text } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { STORY_REVIEW_STATUS } from '../constants';
import { getPeople, getReviewTypes } from '../redux/selectors/projects.selectors';
import { Owner, Review, ReviewTypesObj, State, UrlParams } from '../redux/types';
import MarkdownEditor from './MarkdownEditor';
import { EditableFields } from './StoryModal';

interface ReviewParams {
  originalReviews: Review[];
  currentState: EditableFields;
  storyId: number;
  updateStory: (state: EditableFields) => void;
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

const Reviews = ({
  originalReviews,
  storyId,
  currentState,
  updateStory,
}: ReviewParams): JSX.Element => {
  const [addingReview, setAddingReview] = useState(false);
  const [addingCommentInReviewId, setAddingCommentInReviewId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const people = useSelector(getPeople);
  const router = useRouter();
  const { id }: UrlParams = router.query;
  const reviewTypes = useSelector((state: State): ReviewTypesObj => getReviewTypes(state, id));

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

  const deleteReview = (id: number): void => {
    const withRemovedReview = currentState.reviews.filter(r => r.id !== id);
    updateStory({ ...currentState, reviews: withRemovedReview });
  };

  const setReviewer = (reviewId: number, reviewerId: string): void => {
    const withUpdatedReview = currentState.reviews.map(review =>
      review.id === reviewId ? { ...review, reviewer_id: Number(reviewerId) } : review
    );
    updateStory({ ...currentState, reviews: withUpdatedReview });
  };

  const addReviewComment = (reviewId: number, addUserComment: boolean): void => {
    const originalReview = originalReviews.find(r => r.id === reviewId);
    const updatedReview = currentState.reviews.find(r => r.id === reviewId);

    // If no change in review status, we don't want a new comment
    if (originalReview && originalReview.status === updatedReview.status) {
      return;
    }

    // Pivotal default comment for Pass or Revise status
    let comment = `**${reviewTypes[updatedReview.review_type_id].name}** review set to **${
      updatedReview.status
    }**`;

// If user wrote a comment, we add it
    if (addUserComment && currentComment.length) {
      comment = `${comment} \n \n ${currentComment}`;
    }

    // Create comment or update it if user already created a comment for that review
    const commentIdx = currentState.review_comments.findIndex(c => c.review_id === reviewId);

    if (commentIdx >= 0) {
      const withUpdatedComment = currentState.review_comments.map(comm =>
        comm.review_id === reviewId ? { ...comm, text: comment } : comm
      );
      updateStory({ ...currentState, review_comments: withUpdatedComment });
    } else {
      const newComment = { review_id: reviewId, text: comment };
      updateStory({
        ...currentState,
        review_comments: [...currentState.review_comments, newComment],
      });
    }
  };

  const setReviewStatus = (review: Review, status: string): void => {
    // If status is same as current, just return.
    if (review.status === status) {
      return;
    }

    const withUpdatedReview = currentState.reviews.map(rev =>
      rev.id === review.id ? { ...rev, status } : rev
    );

    if (['pass', 'revise'].includes(status)) {
      setCurrentComment('');
      setAddingCommentInReviewId(review.id);
      setShowModal(true);
      updateStory({ ...currentState, reviews: withUpdatedReview });
    } else {
      // If a review was changed to pass or revise in this session, a comment was created.
      // We should remote it if user changed status again to unstarted or in_review, to avoid saving stale comment.
      const withRemovedComment = currentState.review_comments.filter(
        c => c.review_id !== review.id
      );
      updateStory({
        ...currentState,
        reviews: withUpdatedReview,
        review_comments: withRemovedComment,
      });
      setAddingCommentInReviewId(null);
    }
  };

  const handleReviewAdd = (id: number): void => {
    addReview(id);
    setAddingReview(false);
  };

  const handleModalClose = (reviewId: number, addUserComment = false): void => {
    setShowModal(false);
    addReviewComment(reviewId, addUserComment);
  };

  const AddButtons = () => {
    return (
      <>
        {Object.keys(reviewTypes).map(key => (
          <Button key={key} size="small" onClick={() => handleReviewAdd(Number(key))}>
            {reviewTypes[key].name}
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

      {currentState.reviews.map(
        (rev: Review): JSX.Element => (
          <ReviewCard key={rev.id}>
            <Card>
              <TypeContainer>
                <Text span>{reviewTypes[rev.review_type_id].name}</Text>

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
                  onChange={reviewerId =>
                    setReviewer(rev.id, Array.isArray(reviewerId) ? reviewerId[0] : reviewerId)
                  }>
                  {people.map(
                    (owner: Owner): JSX.Element => (
                      <Select.Option key={owner.id} value={String(owner.id)}>
                        {owner.name}
                      </Select.Option>
                    )
                  )}
                </Select>

                <Text span small>
                  Status:
                </Text>
                <Select
                  placeholder="Status"
                  value={rev.status}
                  size="small"
                  onChange={status =>
                    setReviewStatus(rev, Array.isArray(status) ? status[0] : status)
                  }>
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
      <Modal open={showModal} key={storyId} width="60%" disableBackdropClick>
        <Modal.Title>Add a comment to your review (optional)</Modal.Title>
        <Modal.Content>
          <MarkdownEditor
            key={`${storyId}-comment`}
            defaultValue=""
            placeholder="Add Comment..."
            onChange={comment => setCurrentComment(comment)}
          />
        </Modal.Content>
        <Modal.Action
          disabled={!currentComment.length}
          onClick={() => handleModalClose(addingCommentInReviewId, true)}>
          Add comment
        </Modal.Action>
        <Modal.Action passive onClick={() => handleModalClose(addingCommentInReviewId)}>
          No comment
        </Modal.Action>
      </Modal>
    </>
  );
};

export default Reviews;
