import { Divider, Modal, Text } from '@geist-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { deselectStory } from '../redux/actions/selectedStory.actions';
import { editStory } from '../redux/actions/stories.actions';
import { getSelectedStory, isStorySelected } from '../redux/selectors/selectedStory.selectors';
import { Label, Owner, Story } from '../redux/types';
import AddLabel from './AddLabel';
import Blockers from './Blockers';
import Comments from './Comments';
import EditOwners from './EditOwners';
import Labels from './Labels';
import MarkdownEditor from './MarkdownEditor';

const EDITABLE_FIELDS = ['description', 'owners'];

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

interface EditableFields {
  description?: string;
  owners?: Owner[];
  labels?: Label[];
}

const getEditableFields = (story: Story): EditableFields => ({
  description: story?.description,
  owners: story?.owners || [],
  labels: story?.labels || [],
});

const StoryModal = (): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(isStorySelected);
  const story = useSelector(getSelectedStory);
  const [editedFields, setEditedFields] = useState<EditableFields>(getEditableFields(story));

  useEffect(() => {
    setEditedFields(getEditableFields(story));
  }, [story?.id]);

  const [_, saveStory] = usePivotal(async ({ apiKey, projectId }) => {
    const payload = {
      description: editedFields.description,
      owner_ids: editedFields.owners.map(owner => owner.id),
    };
    const newStory = await PivotalHandler.updateStory({
      apiKey,
      projectId,
      storyId: story.id,
      payload,
    });
    dispatch(editStory(newStory));
    setEditedFields(getEditableFields(newStory));
  });

  const handleClose = () => {
    if (EDITABLE_FIELDS.some(field => editedFields[field] !== story[field])) {
      saveStory();
    }
    dispatch(deselectStory());
  };

  const toggleOwner = (owner: Owner) => {
    const { owners } = editedFields;
    if (owners.find(o => owner.id === o.id)) {
      setEditedFields({ ...editedFields, owners: owners.filter(o => o.id !== owner.id) });
    } else {
      setEditedFields({ ...editedFields, owners: [...owners, owner] });
    }
  };

  return (
    <Modal open={isOpen} key={story?.id} width="60%" onClose={() => handleClose()}>
      <Modal.Title>{story?.name}</Modal.Title>
      <Modal.Content>
        <Section title="Description">
          <MarkdownEditor
            key={story?.id}
            defaultValue={editedFields.description}
            placeholder="Add something..."
            onChange={description => setEditedFields({ ...editedFields, description })}
          />
        </Section>
        <Section title="Owners">
          <EditOwners owners={editedFields.owners} toggleOwner={toggleOwner} />
        </Section>
        <Section title="Labels">
          <AddLabel
            labelAddedToStory={label =>
              setEditedFields({ ...editedFields, labels: [...editedFields.labels, label] })
            }
          />
          <Labels
            labels={editedFields.labels}
            removeLabel={label =>
              setEditedFields({
                ...editedFields,
                labels: editedFields.labels.filter(l => l.id !== label.id),
              })
            }
          />
        </Section>
        <Blockers blockers={story?.blockers} />
        <Divider>Comments</Divider>
        <Comments story={story} />
      </Modal.Content>
    </Modal>
  );
};

export default StoryModal;
