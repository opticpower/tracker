import { Badge, Breadcrumbs, Card, Divider, Spacer } from '@geist-ui/react';
import { useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { selectStory } from '../redux/actions/selectedStory.actions';
import { clearNewStory, editStory, savedNewStory } from '../redux/actions/stories.actions';
import { Iteration, Label, Owner, Story } from '../redux/types';
import BlockersQuickView from './BlockersQuickView';
import EstimateChangeDialog from './Dialogs/EstimateChangeDialog';
import Labels from './Labels';
import Owners from './Owners';

const UNESTIMATED_STORY_TYPES = ['bug', 'chore'];

const CardContainer = styled(Card)(({ color }) => ({
  position: 'relative',
  borderColor: `${color} !important`,
}));

const typeColors = {
  feature: 'gray',
  bug: 'red',
  chore: 'green',
  release: 'blue',
};

const StoryType = styled(Breadcrumbs.Item)(({ color }) => ({
  backgroundColor: color,
  color: 'white',
  padding: '3px',
  fontWeight: '600',
}));

const StyledSpan = styled.span`
  margin-left: 4px;
  cursor: pointer;
  color: #3291ff;
`;

const Title = styled.textarea`
  border: none;
  font-weight: 500;
  overflow: hidden;
  resize: none;
  background: none;
`;

interface StoryCardParams {
  story: Story;
  index: number;
  state: string;
  addFilter: (name: string, filter: Owner | Label | Iteration) => void;
}

const StoryCard = ({ story, state, index, addFilter }: StoryCardParams): JSX.Element => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState<string>(story.name);
  const escape = useRef(false); // we can't use setState for this as the dispatch of this takes an extra tick.

  const [_, saveName] = usePivotal(async ({ apiKey, projectId }) => {
    if (!name || escape.current) {
      escape.current = false;
      if (story.id === 'pending') {
        dispatch(clearNewStory(projectId));
      } else {
        setName(story.name);
      }
      return;
    }

    if (story.name !== name) {
      const newStory = await PivotalHandler.updateStory({
        apiKey,
        projectId,
        storyId: story.id,
        payload: { name },
      });

      if (story.id === 'pending') {
        dispatch(savedNewStory(projectId, newStory));
      } else {
        dispatch(editStory(newStory));
      }
    }
  });

  const openEstimationModal = (e): void => {
    e.stopPropagation();
    setIsModalVisible(true);
  };
  return (
    <>
      <Draggable draggableId={story.id.toString()} index={index}>
        {(provided: Draggable.provided) => (
          <div
            style={{ background: 'green' }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}>
            <CardContainer
              width="250px"
              hoverable
              onClick={e => {
                if (['A', 'SPAN', 'TEXTAREA'].includes(e.target.nodeName)) {
                  return;
                }
                dispatch(selectStory(story));
              }}>
              <Card.Content>
                {Boolean(story?.blockers?.length) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      left: -8,
                    }}>
                    <BlockersQuickView blockers={story.blockers} />
                  </div>
                )}
                <Breadcrumbs size="mini">
                  <StoryType color={typeColors[story.story_type]}>{story.story_type}</StoryType>
                  <Breadcrumbs.Item>
                    <a
                      href={`https://www.pivotaltracker.com/story/show/${story.id}`}
                      target="_blank"
                      rel="noreferrer nofollow">
                      {story.id}
                    </a>
                  </Breadcrumbs.Item>
                  {!UNESTIMATED_STORY_TYPES.includes(story.story_type) && (
                    <Breadcrumbs.Item>
                      {Number.isInteger(story.estimate) ? (
                        <>
                          <Badge onClick={(e): void => openEstimationModal(e)}>
                            {story.estimate}
                          </Badge>
                          <StyledSpan onClick={(e): void => openEstimationModal(e)}>
                            change
                          </StyledSpan>
                        </>
                      ) : (
                        <StyledSpan onClick={(e): void => openEstimationModal(e)}>
                          estimate
                        </StyledSpan>
                      )}
                    </Breadcrumbs.Item>
                  )}
                </Breadcrumbs>
                <Spacer x={0.8} />
                <Title
                  //eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={!name}
                  placeholder="Please, call me something!"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      if (e.key === 'Escape') {
                        escape.current = true;
                      }

                      e.preventDefault();
                      e.target.blur();
                    }
                  }}
                  onBlur={saveName}
                />
              </Card.Content>
              {Boolean(story?.owners?.length || story?.labels?.length) && (
                <>
                  <Divider y={0} />
                  <Card.Content>
                    <Owners owners={story.owners} onClick={addFilter} />
                    <Labels labels={story.labels} onClick={addFilter} />
                  </Card.Content>
                </>
              )}
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
