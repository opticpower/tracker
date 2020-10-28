import { Select } from '@geist-ui/react';

import { STORY_TYPES } from '../constants';
import { Story } from '../redux/types';

interface StoryTypeSelectProps {
  type: string;
  story: Story;
  setType: (value: string) => void;
  saveStoryType: () => void;
}

const StoryTypeSelect = ({
  type,
  story,
  setType,
  saveStoryType,
}: StoryTypeSelectProps): JSX.Element => {
  return (
    <Select
      placeholder="Type"
      value={type}
      size="mini"
      disabled={story.id === 'pending'}
      onChange={value => {
        setType(Array.isArray(value) ? value[0] : value);
        saveStoryType();
      }}
      width="80px">
      {STORY_TYPES.map(type => (
        <Select.Option key={type} value={type}>
          {type}
        </Select.Option>
      ))}
    </Select>
  );
};

export default StoryTypeSelect;
