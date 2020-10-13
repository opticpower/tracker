import { Modal, Input } from '@geist-ui/react';
import { Story } from '../redux/types';

import Owners from './Owners';
import Labels from './Labels';
import Blockers from './Blockers';

interface StoryModalParams {
  story: Story;
  isOpen: boolean;
  close: () => void;
}

const StoryModal = ({ story, isOpen, close }: StoryModalParams): JSX.Element => {
  if (!Boolean(story)) {
    return <></>;
  }

  return (
    <Modal open={isOpen} key={story?.id} onClose={close}>
      <Modal.Title>{story.name}</Modal.Title>
      <Modal.Content>
        {story.description}
        <Owners owners={story.owners} />
        <Labels labels={story.labels} />
        <Blockers blockers={story.blockers} />
      </Modal.Content>
    </Modal>
  );
};

export default StoryModal;
