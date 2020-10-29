import { AutoComplete } from '@geist-ui/react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { getLabels } from '../redux/selectors/projects.selectors';
import { Label } from '../redux/types';

interface AddLabelParams {
  addLabel?: (label: Label) => void;
}

interface SelectLabel {
  label: string;
  kind: string;
  value: string;
}

const labelsToSelects = (labels: Label[]): SelectLabel[] => {
  return labels.map(label => ({
    label: label.name,
    kind: label.kind,
    value: label.id,
  }));
};

// TODO: split out tag filtering tool on top vs card filters, so they can have different visuals.
const AddLabel = ({ addLabel }: AddLabelParams): JSX.Element => {
  const labels = useSelector(getLabels);
  const labelSelects = labelsToSelects(labels);
  const [options, setOptions] = useState(labelSelects);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  //todo: logic to add a brand new label;

  const createNewLabel = async (label): Promise<Label> => {
    //todo: this is where we do the use PivotalBlock.
    //todo: send a pivotal request to create the new label.
  };

  const searchLabels = (currentValue: string): void => {
    const createOptions = [
      {
        value: currentValue,
        label: 'Add "' + currentValue + '"',
        kind: 'label',
      },
    ];

    if (!currentValue) {
      setOptions(labelSelects);
      return;
    }
    const relatedOptions = labelSelects.filter(item => item.label.includes(currentValue));
    const optionsWithCreatable = relatedOptions.length !== 0 ? relatedOptions : createOptions;
    setOptions(optionsWithCreatable);
  };

  //will create the new label or add the new label.
  const selectLabel = async (selectedValue: string): void => {
    setLoading(true);

    let label = labels.find(label => label.id === selectedValue);

    if (!label) {
      label = await createNewLabel(selectedValue);
      console.log('todo: add the label to pivotal to get new id');
      return;
    }

    setValue('');
    addLabel(label);
    setLoading(false);
  };

  return (
    <AutoComplete
      key={typeof value === 'number' ? value : ''} //hack to reset the value ater select
      options={options}
      placeholder="Select Label or Epic"
      searching={loading}
      disabled={loading}
      onSearch={searchLabels}
      onSelect={selectLabel}
      onChange={setValue}
      value={value}
    />
  );
};

export default AddLabel;
