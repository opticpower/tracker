import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@geist-ui/react';
import { Row, Loading, Col } from '@geist-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { DragDropContext } from 'react-beautiful-dnd';
import { NextPage } from 'next';

import ProjectPicker from '../../components/ProjectPicker';
import IterationPicker from '../../components/IterationPicker';
import { useAsync } from '../../hooks';
import Owners from '../../components/Owners';
import Labels from '../../components/Labels';
import Column from '../../components/Column';
import EstimateChangeDialog from '../../components/Dialogs/EstimateChangeDialog';

import PivotalHandler, { STORY_STATES } from '../../handlers/PivotalHandler';
import { addStories, moveStory } from '../../redux/actions/stories.actions';
import { filterStories } from '../../redux/selectors/stories.selectors';
import { getApiKey } from '../../redux/selectors/settings.selectors';
import { State, Story, Filters, Label, Owner, Iteration, UrlParams } from '../../redux/types';
import { redirectIfNoApiKey } from '../../redirects';
import { spacing } from '../../styles';
import { wrapper } from '../../redux/store';
import StoryModal from '../../components/StoryModal';

const Container = styled.div(({ color, image }) => ({
  overflow: 'auto',
  overflowX: 'auto',
  backgroundColor: color,
  backgroundImage: `url(/images/grid-${image}.png)`,
  height: '100%',
  minHeight: 1024,
  paddingTop: spacing(3),
}));

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
  const { id }: UrlParams = router.query;
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({});
  const [selectedStory, setSelectedStory] = useState<Story>();
  const [unestimatedStory, setUnestimatedStory] = useState<Story>();
  const apiKey = useSelector(getApiKey);
  const stories = useSelector((state: State): Record<string, Story[]> => filterStories(state, id, filters));

  const addFilter = (name: string, filter: Owner | Label | Iteration): void => {
    if (name === 'iterations') {
      // @ts-ignore: we know iteration can only be Iteration type
      setFilters({ ...filters, iteration: filter });
      return;
    }
    const array = [...(filters[name] || []), filter];
    setFilters({ ...filters, [name]: Array.from(new Set(array)) });
  };

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

  const openStory = (story: Story) => {
    setSelectedStory(story);
  };

  const closeStory = () => {
    //todo: should we save selected story on close or nawh?
    setSelectedStory(undefined);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      const pivotal = new PivotalHandler();
      const stories = await pivotal.fetchProjectStories({ apiKey, projectId: id });

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

    const pivotal = new PivotalHandler();
    await pivotal.updateStory({ apiKey, projectId: id, storyId: draggableId, payload });
  });

  const loading = !Boolean(stories && Object.values(stories).length);
  const { palette, type } = useTheme();

  return (
    <Container color={palette.accents_1} image={type}>
      <StoryModal isOpen={Boolean(selectedStory)} story={selectedStory} close={closeStory} />
      <FilterContainer>
        <ProjectPicker id={id} />
        <IterationPicker
          id={id}
          selectedIteration={filters.iteration}
          addIteration={val => addFilter('iterations', val)}
          removeIteration={() => removeFilter('iterations', null)}
        />
        <Labels labels={filters.labels} onClick={removeFilter} />
        <Owners owners={filters.owners} onClick={removeFilter} />
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
                openStory={openStory}
              />
            ))}
          </DragDropContext>
        )}
      </Row>
      <EstimateChangeDialog
        story={unestimatedStory}
        state={unestimatedStory?.state}
        open={Boolean(unestimatedStory)}
        onClose={() => setUnestimatedStory(null)}
      />
    </Container>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(redirectIfNoApiKey);

export default Project;
