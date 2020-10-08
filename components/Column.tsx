import { Text, Col } from '@geist-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { Story, Owner, Label, Iteration } from '../redux/types';

import StoryCard from './StoryCard';

interface ColumnParams {
  idx: number;
  state: string;
  stories: Story[];
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
}

const Column = ({ idx, state, stories, addFilter }: ColumnParams): JSX.Element => {
  return (
    <Col key={idx}>
      <Text h3 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
        {state}
      </Text>
      <Droppable key={state} droppableId={idx.toString()}>
        {(provided: Droppable.provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={{ minWidth: 250, height: '100%' }}>
            {(stories || []).map(
              (story: Story, index: number): JSX.Element => (
                <StoryCard story={story} index={index} addFilter={addFilter} />
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
