import { Card, Text } from '@geist-ui/react';
import { formatRelative, parseISO } from 'date-fns';
import { Fragment } from 'react';
import Markdown from 'react-markdown';
import styled from 'styled-components';

import { Comment, Story } from '../redux/types';
import AddComment from './AddComment';
import Person from './Person';

interface CommentsParams {
  story: Story;
}

const AuthorHeader = styled.div`
  display: flex;
  align-items: center;
`;

const DateText = styled(Text).attrs({ small: true })`
  color: ${props => `${props.theme.palette.accents_4} !important`};
`;

const CommentContainer = styled.div`
  padding: 5px 0px 30px 50px !important;
  & .card {
    border-color: ${props => `${props.theme.palette.accents_2} !important`};
  }
`;

const Comments = ({ story }: CommentsParams): JSX.Element => {
  const comments = story.comments;
  if (!comments.length) {
    return (
      <>
        <Text h6>No Comments</Text>
        <AddComment story={story} />
      </>
    );
  }
  return (
    <>
      {comments.map(
        (comment: Comment): JSX.Element => (
          <Fragment key={comment.id}>
            <AuthorHeader>
              <Person person={comment.person} />
              <DateText>{formatRelative(parseISO(comment.created_at), new Date())}</DateText>
            </AuthorHeader>
            <CommentContainer>
              <Card>
                <Markdown>{comment.text}</Markdown>
              </Card>
            </CommentContainer>
          </Fragment>
        )
      )}
      <AddComment story={story} />
    </>
  );
};

export default Comments;
