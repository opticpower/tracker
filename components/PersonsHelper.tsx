import { Button } from '@geist-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPeople } from '../redux/selectors/projects.selectors';
import { Owner } from '../redux/types';

interface Position {
  offsetLeft: number;
  offsetTop: number;
}
interface PersonsHelperParams {
  currentInput: string | null;
  inputPosition: Position;
  onSelect: (userName: string) => void;
}

interface PersonOption {
  label: string;
  value: string;
}

const getDropdownPosition = (inputPosition: Position, dropdownHeight: number): Position => {
  const offsetLeft = inputPosition.offsetLeft;
  const offsetTop =
    inputPosition.offsetTop < 1000
      ? inputPosition.offsetTop + 32
      : inputPosition.offsetTop - dropdownHeight;

  return {
    offsetLeft,
    offsetTop,
  };
};

const OptionsDropdown = styled.div`
  background: #000;
  margin: 0;
  padding: 0;
  border: 1px solid #333;
  border-radius: 5px;
  position: absolute;
  z-index: 999;
  max-width: min-content;
  top: ${props => getDropdownPosition(props.inputPosition, props.dropdownHeight).offsetTop}px;
`;

//TODO: Find a way to avoid the use of !important
const Option = styled(Button)`
  border: 0 !important;
  border-radius: 0 !important;
  text-align: left !important;
`;

const PersonsHelper = ({
  currentInput,
  inputPosition,
  onSelect,
}: PersonsHelperParams): JSX.Element => {
  const people = useSelector<Owner[]>(getPeople);
  const allOptions = people.map(
    (p: Owner): PersonOption => ({
      label: p.username,
      value: p.username.toLowerCase(),
    })
  );
  const [options, setOptions] = useState<PersonOption[]>(allOptions);

  useEffect(() => {
    const searchHandler = (currentValue: string): void => {
      if (!currentValue) return setOptions(allOptions);
      const relatedOptions = allOptions.filter((person: PersonOption): boolean =>
        person.value.includes(currentValue.toLowerCase())
      );
      setOptions(relatedOptions);
    };

    searchHandler(currentInput);
  }, [currentInput]);

  // This value is Geist-UI small button height.
  // Added here as reference because is used to calculate tooltip position
  const BUTTON_HEIGHT = 32;

  return (
    <OptionsDropdown inputPosition={inputPosition} dropdownHeight={options.length * BUTTON_HEIGHT}>
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
