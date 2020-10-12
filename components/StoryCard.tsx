import { useState } from 'react';
import styled from 'styled-components';
import { Text, Spacer, Card, Divider, Badge, Breadcrumbs } from '@geist-ui/react';
import { Draggable } from 'react-beautiful-dnd';

import { Story, Owner, Label, Iteration } from '../redux/types';
import Owners from './Owners';
import Labels from './Labels';
import EstimateChangeDialog from './Dialogs/EstimateChangeDialog';

const CardContainer = styled(Card)(({ color }) => ({
  borderColor: `${color} !important`,
}));

const borderColors = {
  feature: 'gray',
  bug: 'red',
  chore: 'green',
  release: 'blue',
};

const StyledSpan = styled.span`
  margin-left: 4px;
  cursor: pointer;
  color: #3291ff;
`;

interface StoryCardParams {
  story: Story;
  index: number;
  state: string;
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
}

const StoryCard = ({ story, state, index, addFilter }: StoryCardParams): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Draggable key={story.id} draggableId={story.id.toString()} index={index}>
        {(provided: Draggable.provided) => (
          <div
            style={{ background: 'green' }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContainer width="250px" hoverable style={{ borderColor: borderColors[story.story_type] || 'gray' }}>
              <Card.Content>
                <Breadcrumbs size="mini">
                  <Breadcrumbs.Item>{story.story_type}</Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <a
                      href={`https://www.pivotaltracker.com/story/show/${story.id}`}
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      {story.id}
                    </a>
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    {Number.isInteger(story.estimate) ? (
                      <>
                        <Badge onClick={() => setIsModalVisible(true)}>{story.estimate}</Badge>
                        <StyledSpan onClick={() => setIsModalVisible(true)}>change</StyledSpan>
                      </>
                    ) : (
                      <StyledSpan onClick={() => setIsModalVisible(true)}>estimate</StyledSpan>
                    )}
                  </Breadcrumbs.Item>
                </Breadcrumbs>
                <Spacer x={0.8} />
                <Text b>{story.name}</Text>
              </Card.Content>
              <Divider y={0} />
              <Card.Content>
                <Owners owners={story.owners} onClick={addFilter} />
                <Labels labels={story.labels} onClick={addFilter} />
                {/* TODO: Add Github, Blockers */}
              </Card.Content>
            </CardContainer>
            <Spacer y={1} />
          </div>
        )}
      </Draggable>
      <EstimateChangeDialog
        story={story}
        state={state}
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default StoryCard;
