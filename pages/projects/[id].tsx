import { Button, Col, Loading, Row, useTheme } from '@geist-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { GlobalHotKeys } from 'react-hotkeys';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Column from '../../components/Column';
import EstimateChangeDialog from '../../components/Dialogs/EstimateChangeDialog';
import IterationPicker from '../../components/IterationPicker';
import Labels from '../../components/Labels';
import ModePicker from '../../components/ModePicker';
import Owners from '../../components/Owners';
import ProjectPicker from '../../components/ProjectPicker';
import StoryModal from '../../components/StoryModal';
import {
  ESTIMATE_NOT_REQUIRED_STATES,
  STORY_MILESTONES,
  STORY_STATES,
  UNESTIMATED_STORY_TYPES,
} from '../../constants';
import PivotalHandler from '../../handlers/PivotalHandler';
import { useAsync } from '../../hooks';
import { redirectIfNoApiKey } from '../../redirects';
import { addStories, editStory, moveStory, newStory } from '../../redux/actions/stories.actions';
import { getApiKey } from '../../redux/selectors/settings.selectors';
import { filterStories, getSelectedProjectMode } from '../../redux/selectors/stories.selectors';
import { wrapper } from '../../redux/store';
import { Filters, Iteration, Label, Owner, State, Story, UrlParams } from '../../redux/types';
import { spacing } from '../../styles';
import { getStoryPayload } from '../../utils/story';

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
  const [unestimatedStory, setUnestimatedStory] = useState<Story>();
  const apiKey = useSelector(getApiKey);
  const stories = useSelector(
    (state: State): Record<string, Story[]> => filterStories(state, id, filters)
  );
  const mode = useSelector(getSelectedProjectMode);
  const selectedModeStates = mode === 'Milestone' ? STORY_MILESTONES : STORY_STATES;

  const getFilterArray = (filters: Owner[] | Label[] = [], filter: Owner | Label) => {
    if (filters.find(f => f.name === filter.name)) {
      return filters;
    }
    return [...filters, filter];
  };

  const addFilter = (name: string, filter: Owner | Label | Iteration): void => {
    if (name === 'iterations') {
      //todo: we should change this check to a type check and uses classes so we don't have to do this.
      // @ts-ignore: we know iteration can only be Iteration type
      setFilters({ ...filters, iteration: filter });
      return;
    }
    // @ts-ignore: we know filter cannot be type Iteration
    setFilters({ ...filters, [name]: getFilterArray(filters[name], filter) });
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

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      const stories = await PivotalHandler.fetchProjectStories({ apiKey, projectId: id });

      dispatch(addStories(id, stories));
    };
    getStories();
  }, [id]);

  const [, onDragEnd] = useAsync(async (result: DragDropContext.result) => {
    console.log('got result', result);
    const { source, destination, draggableId } = result;

    const { droppableId: sourceDroppableId, index: sourceIndex } = source || {};
    const { droppableId: destinationDroppableId, index: destinationIndex } = destination || {};

    if (!destination) {
      return;
    }

    if (destinationDroppableId === sourceDroppableId && destinationIndex === sourceIndex) {
      return;
    }

    const landingIndex =
      // Calculates the index in between which two stories the dragged story landed.
      destinationDroppableId === sourceDroppableId && destinationIndex > sourceIndex
        ? // Special case when landing further down from the same column the story was taken.
          destinationIndex + 1
        : destinationIndex;

    if (mode === 'Milestone') {
      const sourceMilestone = STORY_MILESTONES[sourceDroppableId];
      const destinationMilestone = STORY_MILESTONES[destinationDroppableId];
      const story = stories[sourceMilestone][sourceIndex];

      dispatch(
        moveStory({
          sourceState: sourceMilestone,
          sourceIndex,
          destinationState: destinationMilestone,
          destinationIndex,
        })
      );
      const updatedStory = await PivotalHandler.updateStory({
        apiKey,
        projectId: id,
        storyId: story.id,
        payload: {
          before_id: stories[destinationMilestone][landingIndex]?.id || null,
          // A null after_id means the story was placed last in the list.
          after_id: stories[destinationMilestone][landingIndex - 1]?.id || null,
          labels: [
            ...story.labels
              .map(label => label.name)
              .filter(name => !STORY_MILESTONES.includes(name)), //remove all milestones from label.
            destinationMilestone, //add new destination milestone
          ],
        },
      });
      dispatch(editStory(updatedStory));
      return;
    }

    const sourceState = STORY_STATES[sourceDroppableId];
    const destinationState = STORY_STATES[destinationDroppableId];
    const story = stories[sourceState][sourceIndex];

    if (
      (!ESTIMATE_NOT_REQUIRED_STATES.includes(sourceState) ||
        !ESTIMATE_NOT_REQUIRED_STATES.includes(destinationState)) &&
      !UNESTIMATED_STORY_TYPES.includes(story.story_type) &&
      !story.estimate
    ) {
      setUnestimatedStory({ ...story, state: sourceState });
      return;
    }

    dispatch(
      moveStory({
        sourceState,
        sourceIndex,
        destinationState,
        destinationIndex,
      })
    );

    await PivotalHandler.updateStory({
      apiKey,
      projectId: id,
      storyId: draggableId,
      payload: getStoryPayload(stories, destinationState, landingIndex),
    });
  });

  const loading = !(stories && Object.values(stories).length);
  const { palette, type } = useTheme();

  return (
    <Container color={palette.accents_1} image={type}>
      <StoryModal />
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
        <ModePicker />
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
            {selectedModeStates.map((state: string, idx: number) => (
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
