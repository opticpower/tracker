import styled from 'styled-components';
import { Text, Col } from '@geist-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { Story, Owner, Label, Iteration } from '../redux/types';
import { useTheme } from '@geist-ui/react';
import StoryCard from './StoryCard';
import { spacing } from '../styles';

const Header = styled(Text)(({ color }) => ({
  color: `${color} !important`,
  textAlign: 'center',
  textTransform: 'capitalize',
  fontFamily: 'Georgia, Times New Roman, Times, serif',
}));

const ColumnContainer = styled(Col)(({ colors, background, shadow }) => ({
  borderTop: `5px solid ${colors}`,
  backgroundColor: background,
  boxShadow: `1px 1px 5px 0px ${shadow}`,
  margin: spacing(2),
  padding: spacing(1),
  height: '100%',
}));

const Card = styled.div(() => ({
  minWidth: 250,
  minHeight: 50,
}));

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
    <ColumnContainer key={idx} colors={colors[state]} background={palette.accents_2} shadow={palette.accents_1}>
      <Header h5 color={palette.accents_6}>
        {state}
      </Header>
      <Droppable key={state} droppableId={idx.toString()}>
        {(provided: Droppable.provided) => (
          <Card {...provided.droppableProps} ref={provided.innerRef}>
            {(stories || []).map(
              (story: Story, index: number): JSX.Element => (
                <StoryCard key={story.id} story={story} index={index} addFilter={addFilter} />
              )
            )}
            {provided.placeholder}
          </Card>
        )}
      </Droppable>
    </ColumnContainer>
  );
};

export default Column;
