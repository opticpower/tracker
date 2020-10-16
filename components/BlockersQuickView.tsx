import { Note, Popover, Spacer, Text } from '@geist-ui/react';
import { useTheme } from '@geist-ui/react';
import { AlertCircleFill } from '@geist-ui/react-icons';
import { Fragment } from 'react';
import styled from 'styled-components';

import { Blocker } from '../redux/types';

interface BlockersQuickViewParams {
  blockers?: Blocker[];
}

const MessageContainer = styled.div`
  color: ${props => props.theme.palette.error};
  padding: ${props => props.theme.layout.gapHalf};
  & ul {
    color: ${props => props.theme.palette.error};
  }
  text-align: left;
`;

const BlockersQuickView = ({ blockers = [] }: BlockersQuickViewParams): JSX.Element => {
  const { palette } = useTheme();
  return (
    <Popover
      trigger="hover"
      content={
        <MessageContainer>
          <b>Blocked by:</b>
          <ul>
            {blockers.map(
              (blocker: Blocker): JSX.Element => (
                <li key={blocker.id}>{blocker.description}</li>
              )
            )}
          </ul>
        </MessageContainer>
      }>
      <AlertCircleFill color={palette.error} />
    </Popover>
  );
};

export default BlockersQuickView;
