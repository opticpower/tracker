import { Button, Col, Text } from '@geist-ui/react';
import { useTheme } from '@geist-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { Iteration, Label, Owner, Story } from '../redux/types';
import { spacing } from '../styles';
import StoryCard from './StoryCard';

const Header = styled(Text)(({ color }) => ({
  color: `${color} !important`,
  textAlign: 'center',
  textTransform: 'capitalize',
  fontFamily: 'Georgia, Times New Roman, Times, serif',
  flexGrow: 1,
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

const HeaderContainer = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  position: absolute !important;
`;

interface ColumnParams {
  idx: number;
  state: string;
  stories: Story[];
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
  hideColumn: () => void;
}

const colors = {
  unscheduled: '#ad6fff',
  unstarted: '#4ebafd',
  started: '#ffd14d',
  finished: '#ff8d48',
  delivered: '#62dbc8',
  rejected: '#ff5757',
  accepted: '#7cd651',
  backlog: '#ad6fff',
  'milestone 1': '#4ebafd',
  'milestone 2': '#ffd14d',
  'milestone 3': '#ff8d48',
};

const Column = ({ idx, state, stories, addFilter, hideColumn }: ColumnParams): JSX.Element => {
  const { type, palette } = useTheme();

  return (
    <ColumnContainer
      key={idx}
      colors={colors[state]}
      background={palette.accents_2}
      shadow={palette.accents_1}>
      <HeaderContainer>
        <Header h5 color={type === 'light' ? palette.accents_6 : palette.accents_7}>
          {state}
        </Header>
        <StyledButton size="mini" auto onClick={() => hideColumn()}>
          Hide
        </StyledButton>
      </HeaderContainer>
      <Droppable key={state} droppableId={idx.toString()}>
        {(provided: Droppable.provided) => (
          <Card {...provided.droppableProps} ref={provided.innerRef}>
            {(stories || []).map(
              (story: Story, index: number): JSX.Element => (
                <StoryCard
                  key={story.id}
                  state={state}
                  story={story}
                  index={index}
                  addFilter={addFilter}
                />
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
