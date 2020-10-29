import { Note, Spacer } from '@geist-ui/react';
import { Fragment } from 'react';

import { Blocker } from '../redux/types';

interface BlockersParams {
  blockers?: Blocker[];
  blockedStoryIds?: number[];
}

const Blockers = ({ blockers = [], blockedStoryIds = [] }: BlockersParams): JSX.Element => (
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
    {blockedStoryIds.map(
      (storyId: number): JSX.Element => (
        <Fragment key={storyId}>
          <Note type="success" label="blocks">
            #{storyId}
          </Note>
          <Spacer y={1} />
        </Fragment>
      )
    )}
  </>
);

export default Blockers;
