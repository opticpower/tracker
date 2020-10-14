import { Divider, Spacer, Text } from '@geist-ui/react';
import { formatRelative, parseISO } from 'date-fns';

import { Comment } from '../redux/types';
import Person from './Person';

interface CommentsParams {
  comments?: Comment[];
}

const Comments = ({ comments = [] }: CommentsParams): JSX.Element => {
  if (!comments.length) {
    return (
      <>
        <Divider>No Comments</Divider>
        {/* Todo: Add Comment Box */}
      </>
    );
  }
  return (
    <>
      <Divider>Comments</Divider>
      {comments.map(
        (comment: Comment): JSX.Element => (
          <>
            {}
            <Person person={comment.person} />
            <Spacer y={1} />
            <Text small>{formatRelative(parseISO(comment.created_at), new Date())}</Text>
            <Spacer y={1} />
            {comment.text}
            <Divider />
          </>
        )
      )}
      {/* Todo: Add Comment Box */}
    </>
  );
};

export default Comments;
