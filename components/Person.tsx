import { User } from '@geist-ui/react';

import { Owner } from '../redux/types';

interface PersonParams {
  person: Owner;
  onClick?: (name: string, filter: Owner) => void;
}

const Person = ({ person, onClick }: PersonParams): JSX.Element => (
  <User
    name={person.name}
    onClick={(): void => onClick && onClick('owners', person)}
    text={person.initials.toUpperCase()}
  />
);

export default Person;
