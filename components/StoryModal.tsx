import { Divider, Modal, Text } from '@geist-ui/react';
import Markdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { deselectStory } from '../redux/actions/selectedStory.actions';
import { getSelectedStory, isStorySelected } from '../redux/selectors/selectedStory.selectors';
import Blockers from './Blockers';
import Comments from './Comments';
import Labels from './Labels';
import Owners from './Owners';

const SectionContainer = styled.div`
  &:not(last-child) {
    margin-bottom: 24px;
  }
`;

const Section = ({ title, children }): JSX.Element => (
  <SectionContainer>
    <Text h6 type="secondary">
      {title}
    </Text>
    {children}
  </SectionContainer>
);

const StoryModal = (): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(isStorySelected);
  const story = useSelector(getSelectedStory);

  return (
    <Modal open={isOpen} key={story?.id} width="60%" onClose={() => dispatch(deselectStory())}>
      <Modal.Title>{story?.name}</Modal.Title>
      <Modal.Content>
        <Section title="Description">
          <Markdown>{story?.description || 'Add something...'}</Markdown>
        </Section>
        <Section title="Owners">
          <Owners owners={story?.owners} />
        </Section>
        <Section title="Tags">
          <Labels labels={story?.labels} />
        </Section>
        <Blockers blockers={story?.blockers} />
        <Divider>Comments</Divider>
        <Comments story={story} />
      </Modal.Content>
    </Modal>
  );
};

export default StoryModal;
