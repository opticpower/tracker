import { Badge, Breadcrumbs, Card, Divider, Spacer } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import PivotalHandler from '../handlers/PivotalHandler';
import { clearNewStory, editStory, savedNewStory } from '../redux/actions/stories.actions';
import { getApiKey } from '../redux/selectors/settings.selectors';
import { Iteration, Label, Owner, Story, UrlParams } from '../redux/types';
import Blockers from './Blockers';
import EstimateChangeDialog from './Dialogs/EstimateChangeDialog';
import Labels from './Labels';
import Owners from './Owners';

const CardContainer = styled(Card)(({ color }) => ({
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
  const apiKey = useSelector(getApiKey);

  const router = useRouter();
  const { id }: UrlParams = router.query;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState<string>(story.name);
  const escape = useRef(false); // we can't use setState for this as the dispatch of this takes an extra tick.

  const saveName = async () => {
    if (!name || escape.current) {
      escape.current = false;
      if (story.id === 'new') {
        dispatch(clearNewStory(id));
      } else {
        setName(story.name);
      }
      return;
    }

    if (story.name !== name) {
      const newStory = await PivotalHandler.updateStory({
        apiKey: apiKey,
        projectId: id,
        storyId: story.id,
        payload: { name },
      });

      if (story.id === 'new') {
        dispatch(savedNewStory(id, newStory));
      } else {
        dispatch(editStory({ projectId: id, story: newStory, storyState: story.current_state }));
      }
    }
  };

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
                router.push(`/projects/${id}?story=${story.id}`);
              }}>
              <Card.Content>
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
              {Boolean(
                story?.owners?.length || story?.labels?.length || story?.blockers?.length
              ) && (
                <>
                  <Divider y={0} />
                  <Card.Content>
                    <Owners owners={story.owners} onClick={addFilter} />
                    <Labels labels={story.labels} onClick={addFilter} />
                    {Boolean(story?.blockers?.length) && (
                      <>
                        <Spacer y={0.5} />
                        <Blockers blockers={story.blockers} />
                      </>
                    )}
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
