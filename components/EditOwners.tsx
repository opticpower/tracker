import { Checkbox } from '@geist-ui/react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPeople } from '../redux/selectors/projects.selectors';
import { Owner } from '../redux/types';

const StyledCheckbox = styled(Checkbox)`
  margin-right: 30px;
`;

interface OwnersParams {
  owners?: Owner[];
  toggleOwner?: (owner: Owner) => void;
}

const EditOwners = ({ owners = [], toggleOwner }: OwnersParams): JSX.Element => {
  const people = useSelector(getPeople);
  const ownerIds = owners.map(owner => owner.id);

  return (
    <>
      {people.map(
        (person: Owner): JSX.Element => (
          <StyledCheckbox
            key={person.id}
            checked={ownerIds.includes(person.id)}
            value={person.id}
            onChange={() => toggleOwner(person)}>
            {person.name}
          </StyledCheckbox>
        )
      )}
    </>
  );
};

export default EditOwners;
