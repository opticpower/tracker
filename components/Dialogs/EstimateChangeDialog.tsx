import { useState } from 'react';
import styled from 'styled-components';
import { Text, Modal, Radio } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useDispatch, useSelector } from 'react-redux';

import { Story, UrlParams } from '../../redux/types';
import { editStory } from '../../redux/actions/stories.actions';
import { getApiKey } from '../../redux/selectors/settings.selectors';
import PivotalHandler from '../../handlers/PivotalHandler';
import { useAsync } from '../../hooks';

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

const EstimateChangeDialog = ({ story, open, state, onClose }: EstimateChangeDialogParams): JSX.Element => {
  const dispatch = useDispatch();
  const apiKey = useSelector(getApiKey);
  const router = useRouter();
  const { id }: UrlParams = router.query;
  const [selectedEstimate, setSelectedEstimate] = useState(story?.estimate ? String(story.estimate) : '');

  const [{ isLoading }, changeEstimate] = useAsync(async () => {
    const newStory: Story = { ...story, estimate: Number(selectedEstimate) };
    dispatch(editStory({ projectId: id, story: newStory, storyState: state }));
    const pivotal = new PivotalHandler();
    await pivotal.updateStory({
      apiKey,
      projectId: id,
      storyId: story.id,
      payload: { estimate: Number(selectedEstimate) },
    });

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
          <Radio.Group value={selectedEstimate} onChange={estimateChangeHandler} useRow>
            {[...new Array(6)].map((_, index: number) => {
              const pointValue = index > 3 ? index + 2 * (index - 4) + 1 : index;
              return (
                <Radio key={index} value={String(pointValue)}>
                  {pointValue}
                </Radio>
              );
            })}
          </Radio.Group>
        </CenteredDiv>
      </Modal.Content>
      <Modal.Action passive onClick={() => onClose()}>
        Cancel
      </Modal.Action>
      <Modal.Action
        loading={isLoading}
        onClick={() => {
          changeEstimate();
        }}
      >
        Submit
      </Modal.Action>
    </Modal>
  );
};

export default EstimateChangeDialog;
