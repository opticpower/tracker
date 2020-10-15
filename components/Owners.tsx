import styled from 'styled-components';

import { Owner } from '../redux/types';
import Person from './Person';

const PersonContainer = styled.div`
  display: ${props => props.display};
`;

interface OwnersParams {
  owners?: Owner[];
  display?: string;
  onClick?: (name: string, filter: Owner) => void;
}

const Owners = ({ owners = [], display = 'block', onClick }: OwnersParams): JSX.Element => (
  <>
    {owners.map(
      (owner: Owner): JSX.Element => (
        <PersonContainer display={display} key={owner.id}>
          <Person person={owner} onClick={onClick} />
        </PersonContainer>
      )
    )}
  </>
);

export default Owners;
