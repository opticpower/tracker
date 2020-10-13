import { Modal } from '@geist-ui/react';

import Owners from './Owners';
import Labels from './Labels';

import { useDispatch, useSelector } from 'react-redux';
import { getSelectedStory, isStorySelected } from '../redux/selectors/selectedStory.selectors';
import { deselectStory } from '../redux/actions/selectedStory.actions';

const StoryModal = (): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(isStorySelected);
  const story = useSelector(getSelectedStory);

  if (!isOpen) {
    return <></>;
  }

  return (
    <Modal open={isOpen} key={story?.id} onClose={() => dispatch(deselectStory())}>
      <Modal.Title>{story.name}</Modal.Title>
      <Modal.Content>
        {story.description}
        <Owners owners={story.owners} />
        <Labels labels={story.labels} />
      </Modal.Content>
    </Modal>
  );
};

export default StoryModal;
