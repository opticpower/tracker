import { Button, Card } from '@geist-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPeople } from '../redux/selectors/projects.selectors';

interface PersonsHelperParams {
  currentInput: string | null;
  onSelect: (userName: string) => void;
}

const OptionsDropdown = styled(Card)`
  position: absolute;
  z-index: 999;
  max-width: 200px;
`;

//TODO: Find a way to avoid the use of !important
const Option = styled(Button)`
  border: 0 !important;
  border-radius: 0 !important;
  text-align: left !important;
`;

const PersonsHelper = ({ currentInput, onSelect }: PersonsHelperParams): JSX.Element => {
  const people = useSelector(getPeople);
  const allOptions = people.map(p => ({ label: p.name, value: p.name.toLowerCase() }));

  const [options, setOptions] = useState(allOptions);

  useEffect(() => {
    const searchHandler = currentValue => {
      if (!currentValue) return setOptions(allOptions);
      const relatedOptions = allOptions.filter(item =>
        item.value.includes(currentValue.toLowerCase())
      );
      setOptions(relatedOptions);
    };

    searchHandler(currentInput);
  }, [currentInput]);

  return (
    <OptionsDropdown>
      {options.length
        ? options.map(opt => (
            <Option
              size="small"
              key={`helper-option-${opt.value}`}
              onClick={() => onSelect(opt.label)}>
              {opt.label}
            </Option>
          ))
        : 'No matches'}
    </OptionsDropdown>
  );
};

export default PersonsHelper;
