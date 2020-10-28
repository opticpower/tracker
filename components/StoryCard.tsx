import { Badge, Breadcrumbs, Card, Divider, Select, Spacer } from '@geist-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { STORY_TYPES, UNESTIMATED_STORY_TYPES } from '../constants';
import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { selectStory } from '../redux/actions/selectedStory.actions';
import { clearNewStory, editStory, savedNewStory } from '../redux/actions/stories.actions';
import { Iteration, Label, Owner, Story } from '../redux/types';
import BlockersQuickView from './BlockersQuickView';
import EstimateChangeDialog from './Dialogs/EstimateChangeDialog';
import Labels from './Labels';
import Owners from './Owners';

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
  width: 100%;
  border: none;
  font-weight: 500;
  resize: none;
  background: none;
`;

// Used to override Card.Content's default 16pt padding
const CardContent = styled(Card.Content)`
  padding: 0 !important;
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
  const [type, setType] = useState<string | string[]>(story.story_type);
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

  const [val, saveStoryType] = usePivotal(async ({ apiKey, projectId }) => {
    if (story.story_type !== type) {
      const newStory = await PivotalHandler.updateStory({
        apiKey,
        projectId,
        storyId: story.id,
        payload: { story_type: type },
      });

      dispatch(editStory(newStory));
    }
  });

  useEffect(() => {
    saveStoryType();
  }, [type]);

  const openEstimationModal = (e): void => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  const StoryTypeSelect = (): JSX.Element => {
    return (
      <Select
        placeholder="Type"
        value={type}
        size="mini"
        disabled={story.id === 'pending'}
        onChange={value => {
          setType(value);
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
              hoverable
              onClick={e => {
                if (['A', 'SPAN', 'TEXTAREA'].includes(e.target.nodeName)) {
                  return;
                }
                dispatch(selectStory(story));
              }}>
              <CardContent>
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
                  {story.id === 'pending' || state === 'unscheduled' ? (
                    <StoryTypeSelect />
                  ) : (
                    <StoryType color={typeColors[story.story_type]}>{story.story_type}</StoryType>
                  )}
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
              </CardContent>
              {Boolean(story?.owners?.length || story?.labels?.length) && (
                <>
                  <Divider y={0} />
                  <Spacer y={0.5} />
                  <CardContent>
                    <Owners owners={story.owners} onClick={addFilter} />
                    <Labels labels={story.labels} onClick={addFilter} />
                  </CardContent>
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
