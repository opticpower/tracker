import { useState } from 'react';
import styled from 'styled-components';
import { Text, Spacer, Card, Divider, Badge, Breadcrumbs, Modal, useModal, Radio } from '@geist-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useDispatch } from 'react-redux';

import { Story, Owner, Label, Iteration, UrlParams } from '../redux/types';
import { editStory } from '../redux/actions/stories.actions';
import PivotalHandler from '../handlers/PivotalHandler';
import { useAsync } from '../hooks';
import Owners from './Owners';
import Labels from './Labels';
import EstimateChangeDialog from './Dialogs/EstimateChangeDialog';

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

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface StoryCardParams {
  story: Story;
  index: number;
  state: string;
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
}

const StoryCard = ({ story, state, index, addFilter }: StoryCardParams): JSX.Element => {
  const dispatch = useDispatch();
  const { apiToken } = parseCookies();
  const router = useRouter();
  const { id }: UrlParams = router.query;
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(story.estimate ? String(story.estimate) : '');
  const { setVisible: setIsModalVisible, bindings } = useModal();

  const [{ isLoading }, changeEstimate] = useAsync(async () => {
    const newStory: Story = { ...story, estimate: Number(selectedEstimate) };
    dispatch(editStory({ projectId: id, story: newStory, storyState: state }));
    const pivotal = new PivotalHandler();
    await pivotal.updateStory({
      apiToken,
      projectId: id,
      storyId: story.id,
      payload: { estimate: Number(selectedEstimate) },
    });

    setIsModalVisible(false);
  });
  const estimateChangeHandler = (value: string): void => setSelectedEstimate(value);
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
            <Card width="250px" hoverable style={{ borderColor: borderColors[story.story_type] || 'gray' }}>
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
            </Card>
            <Spacer y={1} />
          </div>
        )}
      </Draggable>
      <EstimateChangeDialog story={story} open={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </>
  );
};

export default StoryCard;
