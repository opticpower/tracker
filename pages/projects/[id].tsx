import { useEffect, useState } from 'react';
import { Spacer, Row, Loading, Col } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { subDays } from 'date-fns';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';

import ProjectPicker from '../../components/ProjectPicker';
import IterationPicker from '../../components/IterationPicker';
import { useSelector, useDispatch } from 'react-redux';
import {
  State,
  Story,
  Filters,
  Label,
  Owner,
  Iteration,
} from '../../redux/types';
import { addStories, moveStory } from '../../redux/actions/stories.actions';
import { filterStories } from '../../redux/selectors/stories.selectors';
import Owners from '../../components/Owners';
import Labels from '../../components/Labels';
import { useAsync } from '../../hooks';
import { useTheme } from '@geist-ui/react';

import Column from '../../components/Column';

const states = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];

interface Params {
  id?: string;
}

// TODO: move filter container to a separate component
const FilterContainer = styled.div`
  & > * {
    margin: 0 4px;
  }
`;

const Projects = (): JSX.Element => {
  const { apiToken } = parseCookies();
  const router = useRouter();
  const { id }: Params = router.query;
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({});
  const stories = useSelector(
    (state: State): Record<string, Story[]> => filterStories(state, id, filters)
  );

  const addFilter = (name: string, filter: Owner | Label | Iteration): void => {
    if (name === 'iterations') {
      // @ts-ignore: we know iteration can only be Iteration type
      setFilters({ ...filters, iteration: filter });
      return;
    }
    const array = [...(filters[name] || []), filter];
    setFilters({ ...filters, [name]: Array.from(new Set(array)) });
  };

  const removeFilter = (
    name: string,
    filter: Owner | Label | Iteration
  ): void => {
    if (name === 'iterations') {
      const { iteration: omit, ...newFilters } = filters;
      setFilters({ ...newFilters });
      return;
    }
    setFilters({
      ...filters,
      [name]: [
        ...filters[name].filter((element: any): boolean => element !== filter),
      ],
    });
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

        const request = await fetch(
          `https://www.pivotaltracker.com/services/v5/projects/${id}/${fetchString}`,
          {
            headers: {
              'X-TrackerToken': apiToken,
            },
          }
        );
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
      destination: {
        droppableId: destinationDroppableId,
        index: destinationIndex,
      },
      draggableId,
    } = result;

    if (!destination) {
      return;
    }

    if (
      destinationDroppableId === sourceDroppableId &&
      destinationIndex === sourceIndex
    ) {
      return;
    }

    const sourceState = states[sourceDroppableId];
    const destinationState = states[destinationDroppableId];

    dispatch(
      moveStory({
        projectId: id,
        sourceState,
        sourceIndex,
        destinationState,
        destinationIndex,
      })
    );

    const landingIndex =
      // Calculates the index in between which two stories the dragged story landed.
      destinationDroppableId === sourceDroppableId &&
      destinationIndex > sourceIndex
        ? // Special case when landing further down from the same column the story was taken.
          destinationIndex + 1
        : destinationIndex;

    const payload = {
      current_state: destinationState,
      before_id: stories[destinationState][landingIndex]?.id || null,
      // A null before_id means the story was placed first in the list.
      after_id: stories[destinationState][landingIndex - 1]?.id || null,
      // A null after_id means the story was placed last in the list.
    };
    await fetch(
      `https://www.pivotaltracker.com/services/v5/projects/${id}/stories/${draggableId}`,
      {
        method: 'PUT',
        headers: {
          'X-TrackerToken': apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload }),
      }
    );
  });

  const loading = !Boolean(stories && Object.values(stories).length);
  const { palette, type } = useTheme();

  return (
    <div
      style={{
        overflow: 'auto',
        overflowX: 'auto',
        backgroundColor: palette.accents_1,
        backgroundImage: `url(/images/grid-${type}.png)`,
        height: '100%',
        minHeight: 1024,
        paddingTop: 15,
      }}
    >
      <FilterContainer>
        <ProjectPicker id={id} />
        <IterationPicker
          id={id}
          selectedIteration={filters.iteration}
          addIteration={(val) => addFilter('iterations', val)}
          removeIteration={() => removeFilter('iterations', null)}
        />
        <Labels labels={filters.labels} onClick={removeFilter} />
        <Owners owners={filters.owners} onClick={removeFilter} />
      </FilterContainer>

      <Row gap={0.8}>
        {loading && <Loading />}
        <Spacer y={0.8} />
        {!loading && (
          <DragDropContext onDragEnd={onDragEnd}>
            {states.map((state: string, idx: number) => (
              <Column
                key={state}
                state={state}
                idx={idx}
                stories={stories[state]}
                addFilter={addFilter}
              />
            ))}
          </DragDropContext>
        )}
      </Row>
    </div>
  );
};

export default Projects;
