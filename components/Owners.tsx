import { Spacer } from '@geist-ui/react';
import { Fragment } from 'react';

import { Owner } from '../redux/types';
import Person from './Person';

interface OwnersParams {
  owners?: Owner[];
  onClick?: (name: string, filter: Owner) => void;
}

const Owners = ({ owners = [], onClick }: OwnersParams): JSX.Element => (
  <>
    {owners.map(
      (owner: Owner): JSX.Element => (
        <Fragment key={owner.id}>
          <Person person={owner} onClick={onClick} />
          <Spacer y={1} />
        </Fragment>
      )
    )}
  </>
);

export default Owners;
