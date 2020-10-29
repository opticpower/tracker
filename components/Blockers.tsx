import { Note, Spacer } from '@geist-ui/react';
import { Fragment } from 'react';

import { Blocker } from '../redux/types';

interface BlockersParams {
  blockers?: Blocker[];
}

const Blockers = ({ blockers = [] }: BlockersParams): JSX.Element => (
  <>
    {blockers.map(
      (blocker: Blocker): JSX.Element => (
        <Fragment key={blocker.id}>
          <Note
            type={blocker.resolved ? 'secondary' : 'error'}
            label={blocker.resolved ? 'complete' : 'blocker'}>
            {blocker.description}
          </Note>
          <Spacer y={1} />
        </Fragment>
      )
    )}
  </>
);

export default Blockers;
