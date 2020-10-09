import { Tag } from '@geist-ui/react';
import { Label } from '../redux/types';
import styled from 'styled-components';

interface LabelsParams {
  labels?: Label[];
  onClick: (name: string, filter: Label) => void;
}

const getType = (
  name: string
):
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'dark'
  | 'lite' => {
  if (name === 'medium' || name === 'med') {
    return 'warning';
  }

  if (name === 'optic') {
    return 'secondary';
  }

  if (name === 'high') {
    return 'error';
  }
  return 'default';
};

const StyledTag = styled(Tag)`
  font-size: 0.8rem !important;
  font-weight: 600;
  padding: 4px !important;
  height: auto !important;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  &:not(:last-child) {
    margin-right: 5px;
  }
`;

const Labels = ({ labels = [], onClick }: LabelsParams): JSX.Element => (
  <>
    {labels
      .sort((a, b) => (a.name.length > b.name.length ? 1 : -1)) // shorter in front makes fluid multi-line look better
      .map(
        (label: Label): JSX.Element => (
          <StyledTag
            key={label.name}
            type={getType(label.name)}
            onClick={(): void => onClick('labels', label)}
            title={label.name}
            invert
          >
            {label.name}
          </StyledTag>
        )
      )}
  </>
);

export default Labels;
