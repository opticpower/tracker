import { Divider, Modal, Text } from '@geist-ui/react';
import Markdown from 'react-markdown';
import styled from 'styled-components';

import { Story } from '../redux/types';
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

interface StoryModalParams {
  story?: Story;
  onClose?: () => void;
}

const StoryModal = ({ story = null, onClose }: StoryModalParams): JSX.Element => {
  return (
    <Modal open={Boolean(story)} key={story?.id} width="60%" onClose={onClose}>
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
