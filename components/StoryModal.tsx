import { Divider, Modal, Text } from '@geist-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { deselectStory } from '../redux/actions/selectedStory.actions';
import { editStory } from '../redux/actions/stories.actions';
import { getSelectedStory, isStorySelected } from '../redux/selectors/selectedStory.selectors';
import Blockers from './Blockers';
import Comments from './Comments';
import Labels from './Labels';
import MarkdownEditor from './MarkdownEditor';
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
  const [description, setDescription] = useState<string>(story?.description);

  const [_, saveDescription] = usePivotal(async ({ apiKey, projectId }) => {
    const newStory = await PivotalHandler.updateStory({
      apiKey,
      projectId,
      storyId: story.id,
      payload: { description },
    });
    dispatch(editStory(newStory));
  });

  return (
    <Modal open={isOpen} key={story?.id} width="60%" onClose={() => dispatch(deselectStory())}>
      <Modal.Title>{story?.name}</Modal.Title>
      <Modal.Content>
        <Section title="Description">
          <MarkdownEditor
            defaultValue={story?.description}
            placeholder="Add something..."
            onSave={saveDescription}
            onChange={value => setDescription(value)}
          />
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
