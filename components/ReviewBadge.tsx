import { Link, Text, Tooltip } from '@geist-ui/react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPeople } from '../redux/selectors/projects.selectors';
import { Owner, State } from '../redux/types';

const statusColors = {
  unstarted: 'grey',
  in_review: 'yellow',
  pass: 'green',
  revise: 'red',
};

interface OwnersLinksParams {
  ownersData: Owner[] | null;
  onClick?: (name: string, filter: Owner) => void;
}
interface ReviewBadgeParams {
  type: string;
  status: string;
  ownersIds?: number[];
  onClick?: (name: string, filter: Owner) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 4px;

  border-radius: 16px;
  background: ${props => statusColors[props.status] || 'grey'};
`;

const ReviewerText = styled(Text)`
  cursor: pointer;
`;

const OwnersLinks = ({ ownersData, onClick }: OwnersLinksParams): JSX.Element => {
  return (
    <>
      {' ('}
      {ownersData.map(owner => (
        <Tooltip key={`tooltip-${owner.id}`} type="secondary" text={owner.name}>
          <ReviewerText
            type="success"
            size={12}
            span
            key={`link-${owner.id}`}
            onClick={(): void => onClick('owners', owner)}>
            {owner.initials}
          </ReviewerText>
        </Tooltip>
      ))}
      {')'}
    </>
  );
};

const ReviewBadge = ({ type, status, ownersIds, onClick }: ReviewBadgeParams): JSX.Element => {
  let ownersData = null;
  if (ownersIds?.length) {
    ownersData = useSelector((state: State): Owner[] => getPeople(state, ownersIds));
  }

  return (
    <Container>
      <Tooltip type="secondary" text={status}>
        <Icon status={status} />
      </Tooltip>
      <Text size={12} span>
        {type}
        {Boolean(ownersData.length) && <OwnersLinks ownersData={ownersData} onClick={onClick} />}
      </Text>
    </Container>
  );
};

export default ReviewBadge;
