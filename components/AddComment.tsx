import { Button, Textarea } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PivotalHandler from '../handlers/PivotalHandler';
import { editStory } from '../redux/actions/stories.actions';
import { getApiKey } from '../redux/selectors/settings.selectors';
import { Story, UrlParams } from '../redux/types';

interface AddCommentParams {
  story: Story;
}

const AddComment = ({ story }: AddCommentParams): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>();
  const apiKey = useSelector(getApiKey);

  const router = useRouter();
  const dispatch = useDispatch();
  const { id }: UrlParams = router.query;

  const addComment = async () => {
    setLoading(true);
    await PivotalHandler.addComment({ apiKey, projectId: id, storyId: story.id, text: comment });
    const newStory = await PivotalHandler.fetchStory({
      apiKey,
      projectId: id,
      storyId: story.id,
    });
    dispatch(editStory({ projectId: id, story: newStory, storyState: newStory.current_state }));
    setComment('');
    setLoading(false);
  };
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
        loading={loading}
        onClick={addComment}>
        Add
      </Button>
    </>
  );
};

export default AddComment;
