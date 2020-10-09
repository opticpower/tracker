import { Tag } from '@geist-ui/react';
import { Label } from '../redux/types';

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

const Labels = ({ labels = [], onClick }: LabelsParams): JSX.Element => (
  <>
    {labels.map(
      (label: Label): JSX.Element => (
        <Tag
          key={label.name}
          type={getType(label.name)}
          onClick={(): void => onClick('labels', label)}
          style={{ margin: 2 }}
          invert
        >
          {label.name}
        </Tag>
      )
    )}
  </>
);

export default Labels;
