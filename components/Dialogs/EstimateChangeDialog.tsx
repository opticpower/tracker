import { Modal, Text } from '@geist-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import PivotalHandler from '../../handlers/PivotalHandler';
import { useAsync } from '../../hooks';
import { editStory } from '../../redux/actions/stories.actions';
import { getApiKey } from '../../redux/selectors/settings.selectors';
import { getSelectedProjectId } from '../../redux/selectors/stories.selectors';
import { Story } from '../../redux/types';
import EstimatePicker from '../EstimatePicker';

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface EstimateChangeDialogParams {
  story: Story;
  open: boolean;
  state: string;
  onClose: () => void;
}

const EstimateChangeDialog = ({
  story,
  open,
  state,
  onClose,
}: EstimateChangeDialogParams): JSX.Element => {
  const dispatch = useDispatch();
  const apiKey = useSelector(getApiKey);
  const projectId = useSelector(getSelectedProjectId);
  const [selectedEstimate, setSelectedEstimate] = useState(
    story?.estimate ? String(story.estimate) : ''
  );

  const [{ isLoading }, changeEstimate] = useAsync(async () => {
    const newStory = await PivotalHandler.updateStory({
      apiKey,
      projectId: projectId,
      storyId: story.id,
      payload: { estimate: Number(selectedEstimate) },
    });

    dispatch(editStory(newStory));

    onClose();
  });
  const estimateChangeHandler = (value: string): void => setSelectedEstimate(value);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Title>{story?.name}</Modal.Title>
      <Modal.Subtitle>Change Story Estimate</Modal.Subtitle>
      <Modal.Content>
        <CenteredDiv>
          <Text h5> Select the amount of effort points of this story.</Text>
          <EstimatePicker value={selectedEstimate} onChange={estimateChangeHandler} />
        </CenteredDiv>
      </Modal.Content>
      <Modal.Action passive onClick={() => onClose()}>
        Cancel
      </Modal.Action>
      <Modal.Action loading={isLoading} onClick={() => changeEstimate()}>
        Submit
      </Modal.Action>
    </Modal>
  );
};

export default EstimateChangeDialog;
