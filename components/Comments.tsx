import { Divider, Spacer, Text } from '@geist-ui/react';
import { formatRelative, parseISO } from 'date-fns';
import { Fragment } from 'react';
import Markdown from 'react-markdown';

import { Comment, Story } from '../redux/types';
import AddComment from './AddComment';
import Person from './Person';

interface CommentsParams {
  story: Story;
}

const Comments = ({ story }: CommentsParams): JSX.Element => {
  const comments = story.comments;
  if (!comments.length) {
    return (
      <>
        <Divider>No Comments</Divider>
        <AddComment story={story} />
      </>
    );
  }
  return (
    <>
      <Divider>Comments</Divider>
      {comments.map(
        (comment: Comment): JSX.Element => (
          <Fragment key={comment.id}>
            {}
            <Person person={comment.person} />
            <Spacer y={1} />
            <Text small>{formatRelative(parseISO(comment.created_at), new Date())}</Text>
            <Spacer y={1} />
            <Markdown>{comment.text}</Markdown>
            <Divider />
          </Fragment>
        )
      )}
      <AddComment story={story} />
    </>
  );
};

export default Comments;
