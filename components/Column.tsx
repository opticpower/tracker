import { Text, Col } from '@geist-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { Story, Owner, Label, Iteration } from '../redux/types';
import { useTheme } from '@geist-ui/react';
import StoryCard from './StoryCard';

interface ColumnParams {
  idx: number;
  state: string;
  stories: Story[];
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
}

const colors = {
  unscheduled: '#ad6fff',
  unstarted: '#4ebafd',
  started: '#ffd14d',
  finished: '#ff8d48',
  delivered: '#62dbc8',
  rejected: '#ff5757',
  accepted: '#7cd651',
};

const Column = ({ idx, state, stories, addFilter }: ColumnParams): JSX.Element => {
  const { palette } = useTheme();

  return (
    <Col
      key={idx}
      style={{
        borderTop: `5px solid ${colors[state]}`,
        backgroundColor: palette.accents_2,
        boxShadow: `1px 1px 5px 0px ${palette.accents_1}`,
        margin: 10,
        padding: 5,
        height: '100%',
      }}
    >
      <Text
        h5
        style={{
          textAlign: 'center',
          textTransform: 'capitalize',
          color: palette.accents_6,
          fontFamily: 'Georgia, Times New Roman, Times, serif',
        }}
      >
        {state}
      </Text>
      <Droppable key={state} droppableId={idx.toString()}>
        {(provided: Droppable.provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={{ minWidth: 250, minHeight: 50 }}>
            {(stories || []).map(
              (story: Story, index: number): JSX.Element => (
                <StoryCard key={story.id} story={story} index={index} addFilter={addFilter} />
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Col>
  );
};

export default Column;
