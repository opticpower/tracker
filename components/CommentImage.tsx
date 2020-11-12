import { Image, Modal } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';

import { AttachmentFile } from '../redux/types';

interface CommentAttachmentsParams {
  attachments: AttachmentFile[];
}

const AttachmentsContainer = styled.div`
  display: flex;
`;

const CustomImage = styled(Image)`
  border: 1px solid white;
  margin: 0 8px !important;
  cursor: pointer;
`;

const CommentAttachments = ({ attachments }: CommentAttachmentsParams): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const router = useRouter();

  const PIVOTAL_URL = 'https://www.pivotaltracker.com';

  const handleShowModal = (fileData: AttachmentFile): void => {
    setCurrentFile(fileData);
    setShowModal(true);
  };

  const handleModalClose = (): void => {
    setShowModal(false);
    setCurrentFile(null);
  };

  return (
    <AttachmentsContainer>
      {attachments?.map(file => (
        <CustomImage
          key={`thumb-${file.id}`}
          width={120}
          height={80}
          src={file.thumbnail_url}
          onClick={() => handleShowModal(file)}
        />
      ))}
      {currentFile && (
        <Modal
          open={showModal}
          key={`modal-${currentFile.id}`}
          width="60%"
          onClose={() => handleModalClose()}>
          <Modal.Title>{currentFile.filename}</Modal.Title>
          <Modal.Content>
            {currentFile.thumbnailable ? (
              <Image
                key={`img-${currentFile.id}`}
                width={currentFile.width}
                height={currentFile.height}
                src={currentFile.big_url}
              />
            ) : (
              'No preview'
            )}
          </Modal.Content>
          <Modal.Action onClick={() => router.push(`${PIVOTAL_URL}${currentFile.download_url}`)}>
            Download
          </Modal.Action>
          <Modal.Action passive onClick={() => handleModalClose()}>
            Close
          </Modal.Action>
        </Modal>
      )}
    </AttachmentsContainer>
  );
};

export default CommentAttachments;
