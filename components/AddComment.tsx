import { Button } from '@geist-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { editStory } from '../redux/actions/stories.actions';
import { Story } from '../redux/types';
import MarkdownEditor from './MarkdownEditor';

interface AddCommentParams {
  story: Story;
}

const AddComment = ({ story }: AddCommentParams): JSX.Element => {
  const [comment, setComment] = useState<string>();
  /* This will be used as the key for the Markdown component and will be updated on comment save.
  We do this to force a re-render and reset the component state, avoiding buggy behaviors. */
  const [inputKey, setInputKey] = useState(`comment-${Date.now()}`);

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
    setInputKey(`comment-${Date.now()}`);
  });

  return (
    <>
      <MarkdownEditor
        key={inputKey}
        defaultValue={comment}
        placeholder="Add Comment..."
        onChange={comment => setComment(comment)}
      />
      <Button
        disabled={!comment || comment === '\n'}
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
