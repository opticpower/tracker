import { Modal } from '@geist-ui/react';
import { useDispatch, useSelector } from 'react-redux';

import { deselectStory } from '../redux/actions/selectedStory.actions';
import { getSelectedStory, isStorySelected } from '../redux/selectors/selectedStory.selectors';
import Blockers from './Blockers';
import Comments from './Comments';
import Labels from './Labels';
import Owners from './Owners';

const StoryModal = (): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(isStorySelected);
  const story = useSelector(getSelectedStory);

  if (!isOpen) {
    return <></>;
  }

  return (
    <Modal open={isOpen} key={story?.id} width="60%" onClose={() => dispatch(deselectStory())}>
      <Modal.Title>{story.name}</Modal.Title>
      <Modal.Content>
        {story.description}
        <Owners owners={story.owners} />
        <Labels labels={story.labels} />
        <Blockers blockers={story.blockers} />
        <Comments comments={story.comments} />
      </Modal.Content>
    </Modal>
  );
};

export default StoryModal;
