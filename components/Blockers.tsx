import { Fragment } from 'react';
import { Note, Spacer } from '@geist-ui/react';
import { Blocker } from '../redux/types';

interface BlockersParams {
  blockers?: Blocker[];
}

const Blockers = ({ blockers = [] }: BlockersParams): JSX.Element => (
  <>
    {blockers.map(
      (blocker: Blocker): JSX.Element => (
        <Fragment key={blocker.id}>
          <Note type="error" label="blocker">
            {blocker.description}
          </Note>
          <Spacer y={1} />
        </Fragment>
      )
    )}
  </>
);

export default Blockers;
