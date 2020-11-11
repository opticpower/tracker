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

interface ReviewBadgeParams {
  type: string;
  status: string;
  ownersIds?: number[];
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

const OwnersLinks = ({ ownersData }: { ownersData: Owner[] | null }): JSX.Element => {
  return (
    <>
      {' ('}
      {ownersData.map(owner => (
        <Tooltip key={`tooltip-${owner.id}`} type="secondary" text={owner.name}>
          <Link color key={`link-${owner.id}`}>
            {owner.initials}
          </Link>
        </Tooltip>
      ))}
      {')'}
    </>
  );
};

const ReviewBadge = ({ type, status, ownersIds }: ReviewBadgeParams): JSX.Element => {
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
        {Boolean(ownersData.length) && <OwnersLinks ownersData={ownersData} />}
      </Text>
    </Container>
  );
};

export default ReviewBadge;
