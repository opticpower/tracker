import { Button, Col, Loading, Row, useTheme } from '@geist-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { GlobalHotKeys } from 'react-hotkeys';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Column from '../../components/Column';
import EstimateChangeDialog from '../../components/Dialogs/EstimateChangeDialog';
import IterationPicker from '../../components/IterationPicker';
import Labels from '../../components/Labels';
import Owners from '../../components/Owners';
import ProjectPicker from '../../components/ProjectPicker';
import StoryModal from '../../components/StoryModal';
import PivotalHandler, { STORY_STATES } from '../../handlers/PivotalHandler';
import { useAsync } from '../../hooks';
import { redirectIfNoApiKey } from '../../redirects';
import { addStories, moveStory, newStory } from '../../redux/actions/stories.actions';
import { getApiKey } from '../../redux/selectors/settings.selectors';
import { filterStories, getStory } from '../../redux/selectors/stories.selectors';
import { wrapper } from '../../redux/store';
import { Filters, Iteration, Label, Owner, State, Story, UrlParams } from '../../redux/types';
import { spacing } from '../../styles';

const Container = styled.div(({ color, image }) => ({
  overflow: 'auto',
  overflowX: 'auto',
  backgroundColor: color,
  backgroundImage: `url(/images/grid-${image}.png)`,
  height: '100%',
  minHeight: 1024,
  paddingTop: spacing(3),
}));

const getFilterArray = (filters: Owner[] | Label[] = [], filter: Owner | Label) => {
  if (filters.find(f => f.name === filter.name)) {
    return filters;
  }
  return [...filters, filter];
};

const Project: NextPage = (): JSX.Element => {
  // TODO: move filter container to a separate component
  const FilterContainer = styled.div`
    padding: 10px 16px;
    & > * {
      vertical-align: middle;
      margin: 0 4px;
    }
  `;

  const router = useRouter();
  const { id, story: selectedStoryId }: UrlParams = router.query;
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({});
  const [unestimatedStory, setUnestimatedStory] = useState<Story>();
  const apiKey = useSelector(getApiKey);
  const stories = useSelector(
    (state: State): Record<string, Story[]> => filterStories(state, id, filters)
  );
  const selectedStory = useSelector((state: State): Story => getStory(state, id, selectedStoryId));

  const addFilter = useCallback(
    (name: string, filter: Owner | Label | Iteration): void => {
      if (name === 'iterations') {
        //todo: we should change this check to a type check and uses classes so we don't have to do this.
        // @ts-ignore: we know iteration can only be Iteration type
        setFilters({ ...filters, iteration: filter });
        return;
      }
      // @ts-ignore: we know filter cannot be type Iteration
      setFilters({ ...filters, [name]: getFilterArray(filters[name], filter) });
    },
    [filters, setFilters]
  );

  const removeFilter = (name: string, filter: Owner | Label | Iteration): void => {
    if (name === 'iterations') {
      const { iteration: omit, ...newFilters } = filters;
      setFilters({ ...newFilters });
      return;
    }
    setFilters({
      ...filters,
      [name]: [...filters[name].filter((element: any): boolean => element !== filter)],
    });
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      const stories = await PivotalHandler.fetchProjectStories({ apiKey, projectId: id });

      dispatch(addStories({ id, stories }));
    };
    getStories();
  }, [id]);

  const [, onDragEnd] = useAsync(async (result: DragDropContext.result) => {
    const { source, destination, draggableId } = result;

    const { droppableId: sourceDroppableId, index: sourceIndex } = source || {};
    const { droppableId: destinationDroppableId, index: destinationIndex } = destination || {};

    if (!destination) {
      return;
    }

    if (destinationDroppableId === sourceDroppableId && destinationIndex === sourceIndex) {
      return;
    }
    const sourceState = STORY_STATES[sourceDroppableId];

    if (!stories[sourceState][sourceIndex].estimate) {
      setUnestimatedStory({ ...stories[sourceState][sourceIndex], state: sourceState });
      return;
    }

    const destinationState = STORY_STATES[destinationDroppableId];

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
      destinationDroppableId === sourceDroppableId && destinationIndex > sourceIndex
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

    await PivotalHandler.updateStory({ apiKey, projectId: id, storyId: draggableId, payload });
  });

  const loading = !(stories && Object.keys(stories).length);
  const { palette, type } = useTheme();

  return (
    <Container color={palette.accents_1} image={type}>
      <StoryModal
        story={selectedStory}
        onClose={() => {
          router.push(`/projects/${id}`, undefined, { shallow: true });
        }}
      />
      <FilterContainer>
        <GlobalHotKeys
          keyMap={{ NEW_STORY: 'n' }}
          handlers={{
            NEW_STORY: e => {
              e.preventDefault();
              dispatch(newStory(id));
            },
          }}
        />
        <Button onClick={() => dispatch(newStory(id))}>New Story (n)</Button>
        <ProjectPicker id={id} />
        <IterationPicker
          id={id}
          selectedIteration={filters.iteration}
          addIteration={val => addFilter('iterations', val)}
          removeIteration={() => removeFilter('iterations', null)}
        />
        <Labels labels={filters.labels} onClick={removeFilter} />
        <Owners owners={filters.owners} onClick={removeFilter} display="inline-block" />
      </FilterContainer>

      <Row gap={0.8}>
        {loading && (
          <Col>
            <Loading />
          </Col>
        )}
        {!loading && (
          <DragDropContext onDragEnd={onDragEnd}>
            {STORY_STATES.map((state: string, idx: number) => (
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
      <EstimateChangeDialog
        story={unestimatedStory}
        state={unestimatedStory?.current_state}
        open={Boolean(unestimatedStory)}
        onClose={() => setUnestimatedStory(null)}
      />
    </Container>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(redirectIfNoApiKey);

export default Project;
