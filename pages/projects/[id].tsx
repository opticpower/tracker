import { useEffect, useState } from 'react';
import { Text, Spacer, Row, Col, Card, Divider, Loading, Badge, Breadcrumbs } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { subDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ProjectPicker from '../../components/ProjectPicker';
import { useSelector, useDispatch } from 'react-redux';
import { State, Story, Filters, Label, Owner } from '../../redux/types';
import { addStories, moveStory } from '../../redux/actions/stories.actions';
import { filterStories } from '../../redux/selectors/stories.selectors';
import Owners from '../../components/Owners';
import Labels from '../../components/Labels';
import { useAsync } from '../../hooks';

const states = ['unscheduled', 'unstarted', 'started', 'finished', 'delivered', 'rejected', 'accepted'];

interface Params {
  id?: string;
}

const Projects = (): JSX.Element => {
  const { apiToken } = parseCookies();
  const router = useRouter();
  const { id }: Params = router.query;
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({});
  const stories = useSelector((state: State): Record<string, Story[]> => filterStories(state, id, filters));

  const addFilter = (name: string, filter: Owner | Label): void => {
    const array = [...(filters[name] || []), filter];
    setFilters({ ...filters, [name]: Array.from(new Set(array)) });
  };

  const removeFilter = (name: string, filter: Owner | Label): void => {
    setFilters({ ...filters, [name]: [...filters[name].filter((element: any): boolean => element !== filter)] });
  };

  const getBorderColor = (type: string): string => {
    if (type === 'feature') {
      return 'gray';
    }
    if (type === 'bug') {
      return 'red';
    }
    if (type === 'chore') {
      return 'green';
    }
    if (type === 'release') {
      return 'blue';
    }
    return 'gray';
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      let stories = {};

      //todo: we should do Promise.all for these
      for (const state of states) {
        let fetchString = `stories?limit=500&with_state=${state}&fields=name,estimate,owners,labels,blockers,reviews,story_type`;
        if (state === 'Accepted') {
          const oneWeekAgo = subDays(new Date(), 7);
          fetchString = `${fetchString}&accepted_after=${oneWeekAgo.getTime()}`;
        }

        const request = await fetch(`https://www.pivotaltracker.com/services/v5/projects/${id}/${fetchString}`, {
          headers: {
            'X-TrackerToken': apiToken,
          },
        });
        stories = { ...stories, [state]: await request.json() };
      }

      dispatch(addStories({ id, stories }));
    };
    getStories();
  }, [id]);

  const [, onDragEnd] = useAsync(async (result: DragDropContext.result) => {
    const {
      source: { droppableId: sourceDroppableId, index: sourceIndex },
      destination,
      destination: { droppableId: destinationDroppableId, index: destinationIndex },
      draggableId,
    } = result;

    if (!destination) {
      return;
    }

    if (destinationDroppableId === sourceDroppableId && destinationIndex === sourceIndex) {
      return;
    }

    const sourceState = states[sourceDroppableId];
    const destinationState = states[destinationDroppableId];

    dispatch(moveStory({ projectId: id, sourceState, sourceIndex, destinationState, destinationIndex }));

    const landingIndex =
      // Calculates the index in between which two stories the dragged story landed.
      destinationDroppableId === sourceDroppableId && destinationIndex > sourceIndex
        ? // Special case when landing further down from the same column the story was taken.
          destinationIndex + 1
        : destinationIndex;
    const before_id = stories[destinationState][landingIndex]?.id || null;
    const after_id = stories[destinationState][landingIndex - 1]?.id || null;
    // A null before_id means the story was placed first in the list.
    const payload = {
      current_state: destinationState,
      before_id,
      // When moving stories to an empty column, both before_id and after_id will be null.
      // Pivotal error if yo set a story to the first and the last item of the list. Even if is the only one.
      ...(before_id === null && before_id === after_id ? {} : { after_id }),
    };
    await fetch(`https://www.pivotaltracker.com/services/v5/projects/${id}/stories/${draggableId}`, {
      method: 'PUT',
      headers: {
        'X-TrackerToken': apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload }),
    });
  });

  const loading = !Boolean(stories && Object.values(stories).length);

  return (
    <div style={{ overflow: 'scroll' }}>
      <Row gap={0.8}>
        <ProjectPicker id={id} />
        <Labels labels={filters.labels} onClick={removeFilter} />
        <Owners owners={filters.owners} onClick={removeFilter} />
      </Row>

      <Row gap={0.8}>
        {loading && <Loading />}
        <Spacer y={0.8} />
        {!loading && (
          <DragDropContext onDragEnd={onDragEnd}>
            {states.map((state: string, idx: number) => (
              <Col key={idx}>
                <Text h3 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                  {state}
                </Text>
                <Droppable key={state} droppableId={idx.toString()}>
                  {(provided: Droppable.provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ minWidth: 250, height: '100%' }}>
                      {(stories[state] || []).map(
                        (story: Story, index: number): JSX.Element => (
                          <Draggable key={story.id} draggableId={story.id.toString()} index={index}>
                            {(provided: Draggable.provided) => (
                              <div
                                style={{ background: 'green' }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <Card width="250px" hoverable style={{ borderColor: getBorderColor(story.story_type) }}>
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
                                    Add Github, Blockers
                                  </Card.Content>
                                </Card>
                                <Spacer y={1} />
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            ))}
          </DragDropContext>
        )}
      </Row>
    </div>
  );
};

export default Projects;
