import { Select } from '@geist-ui/react';
import { useDispatch, useSelector } from 'react-redux';

import { toggleMode } from '../redux/actions/stories.actions';
import { getSelectedProjectMode } from '../redux/selectors/stories.selectors';
import { StoryModes } from '../redux/types';

/**
 * Selects mode of the board.
 */
const ModePicker = (): JSX.Element => {
  const storyMode = useSelector(getSelectedProjectMode);
  const dispatch = useDispatch();

  return (
    <Select
      disableMatchWidth
      width="200px"
      value={storyMode}
      onChange={value => {
        console.log('changing value to', value);
        const mode = Array.isArray(value) ? value[0] : value;
        dispatch(toggleMode(mode));
      }}>
      {Object.values(StoryModes).map(mode => {
        return (
          <Select.Option key={mode} id={mode} value={mode}>
            {mode}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default ModePicker;
