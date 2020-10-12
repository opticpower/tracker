import {
  Text,
  Spacer,
  Card,
  Divider,
  Badge,
  Breadcrumbs,
} from '@geist-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { Story, Owner, Label, Iteration } from '../redux/types';

import Owners from './Owners';
import Labels from './Labels';

const borderColors = {
  feature: 'gray',
  bug: 'red',
  chore: 'green',
  release: 'blue',
};

interface StoryCardParams {
  story: Story;
  index: number;
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
}

const StoryCard = ({
  story,
  index,
  addFilter,
}: StoryCardParams): JSX.Element => {
  return (
    <Draggable key={story.id} draggableId={story.id.toString()} index={index}>
      {(provided: Draggable.provided) => (
        <div
          style={{ background: 'green' }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card
            width='250px'
            hoverable
            style={{ borderColor: borderColors[story.story_type] || 'gray' }}
          >
            <Card.Content>
              <Breadcrumbs size='mini'>
                <Breadcrumbs.Item>{story.story_type}</Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <a
                    href={`https://www.pivotaltracker.com/story/show/${story.id}`}
                    target='_blank'
                    rel='noreferrer nofollow'
                  >
                    {story.id}
                  </a>
                </Breadcrumbs.Item>
                {Number.isInteger(story.estimate) && (
                  <Breadcrumbs.Item>
                    <Badge>{story.estimate}</Badge>
                  </Breadcrumbs.Item>
                )}
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
          </Card>
          <Spacer y={1} />
        </div>
      )}
    </Draggable>
  );
};

export default StoryCard;
