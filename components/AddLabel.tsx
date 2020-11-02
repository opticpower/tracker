import { AutoComplete } from '@geist-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { addLabel } from '../redux/actions/projects.actions';
import { getLabels } from '../redux/selectors/projects.selectors';
import { Label } from '../redux/types';

interface AddLabelParams {
  labelAddedToStory?: (label: Label) => void;
}

interface SelectLabel {
  label: string;
  value: string;
}

const labelsToSelects = (labels: Label[]): SelectLabel[] => {
  return labels?.map(label => ({
    label: label.name,
    value: label.id,
  }));
};

const AddLabel = ({ labelAddedToStory }: AddLabelParams): JSX.Element => {
  const labels = useSelector(getLabels);
  const labelSelects = labelsToSelects(labels);
  const [options, setOptions] = useState(labelSelects);
  const [value, setValue] = useState<string>('');
  const dispatch = useDispatch();

  const [{ isLoading }, createNewLabel] = usePivotal(async ({ apiKey, projectId }) => {
    const newLabel = await PivotalHandler.createLabel({
      apiKey,
      projectId,
      name: value,
    });
    dispatch(addLabel(projectId, newLabel)); //adding to global state;
    labelAddedToStory(newLabel); //adding to current story;
  });

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
  const selectLabel = (selectedValue: string): void => {
    const label = labels.find(label => label.id === selectedValue);

    if (!label) {
      createNewLabel({ name: selectedValue });
      setValue('');
      return;
    }
    labelAddedToStory(label);
  };

  return (
    <AutoComplete
      key={typeof value === 'number' ? value : ''} //hack to reset the value ater select
      options={options}
      placeholder="Select Label or Epic"
      searching={isLoading}
      disabled={isLoading}
      onSearch={searchLabels}
      onSelect={selectLabel}
      onChange={setValue}
      value={value}
    />
  );
};

export default AddLabel;
