import { Modal, Text } from '@geist-ui/react';
import { ZeroConfig } from '@geist-ui/react-icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ESTIMATE_NOT_REQUIRED_STATES } from '../../constants';
import PivotalHandler from '../../handlers/PivotalHandler';
import { usePivotal } from '../../hooks';
import { editStory } from '../../redux/actions/stories.actions';
import { Story } from '../../redux/types';
import EstimatePicker from '../EstimatePicker';

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledSpan = styled.span`
  cursor: pointer;
  width: 165px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  :hover {
    text-decoration: underline;
  }
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
  onClose,
}: EstimateChangeDialogParams): JSX.Element => {
  const dispatch = useDispatch();
  const [selectedEstimate, setSelectedEstimate] = useState(
    story?.estimate ? String(story.estimate) : ''
  );

  const [{ isLoading }, changeEstimate] = usePivotal(async ({ apiKey, projectId }) => {
    const newStory = await PivotalHandler.updateStory({
      apiKey,
      projectId,
      storyId: story.id,
      payload: { estimate: selectedEstimate ? Number(selectedEstimate) : null },
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
          {ESTIMATE_NOT_REQUIRED_STATES.includes(story?.current_state) &&
            Number.isInteger(story?.estimate) && (
              <StyledSpan onClick={() => setSelectedEstimate('')}>
                <ZeroConfig size={16} />
                Set to Unestimated
              </StyledSpan>
            )}
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
