import { Button, Textarea } from '@geist-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { editStory } from '../redux/actions/stories.actions';
import { Story } from '../redux/types';

interface AddCommentParams {
  story: Story;
}

const AddComment = ({ story }: AddCommentParams): JSX.Element => {
  const [comment, setComment] = useState<string>();

  const dispatch = useDispatch();

  const [{ isLoading }, addComment] = usePivotal(async ({ apiKey, projectId }) => {
    await PivotalHandler.addComment({ apiKey, projectId, storyId: story.id, text: comment });
    const newStory = await PivotalHandler.fetchStory({
      apiKey,
      projectId,
      storyId: story.id,
    });
    dispatch(editStory(newStory));
    setComment('');
  });

  return (
    <>
      <Textarea
        width="100%"
        placeholder="Add Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <Button
        disabled={!comment}
        type="success"
        size="small"
        loading={isLoading}
        onClick={() => addComment()}>
        Add
      </Button>
    </>
  );
};

export default AddComment;
