import { Modal } from '@geist-ui/react';
import { Story } from '../../redux/types';

interface EstimateChangingDialogParams {
  story: Story;
  open: boolean;
  onClose: Function;
}

const EstimateChangingDialog = ({ story, open, onClose }: EstimateChangingDialogParams): JSX.Element => {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Title>Change Story Estimate</Modal.Title>
      <Modal.Subtitle>{story.name}</Modal.Subtitle>
      <Modal.Content>
        <p>Some content contained within the modal.</p>
      </Modal.Content>
      <Modal.Action passive onClick={onClose}>
        Cancel
      </Modal.Action>
      <Modal.Action>Submit</Modal.Action>
    </Modal>
  );
};

export default EstimateChangingDialog;
