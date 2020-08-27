import { Fragment } from 'react';
import { Spacer, User } from '@geist-ui/react';
import { Owner } from '../redux/types';

interface OwnersParams {
  owners?: Owner[];
  onClick: (name: string, filter: Owner) => void;
}

const Owners = ({ owners = [], onClick }: OwnersParams): JSX.Element => (
  <>
    {owners.map(
      (owner: Owner): JSX.Element => (
        <Fragment key={owner.id}>
          <User name={owner.name} onClick={(): void => onClick('owners', owner)} text={owner.initials.toUpperCase()} />
          <Spacer y={1} />
        </Fragment>
      )
    )}
  </>
);

export default Owners;
