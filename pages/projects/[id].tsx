import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spacer, Row, Loading, Modal, useModal, Radio, Text } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTheme } from '@geist-ui/react';
import { useSelector, useDispatch } from 'react-redux';

import { State, Story, Filters, Label, Owner, Iteration, UrlParams } from '../../redux/types';
import { addStories, moveStory, editStory } from '../../redux/actions/stories.actions';
import { filterStories } from '../../redux/selectors/stories.selectors';
import { useAsync } from '../../hooks';
import PivotalHandler, { STORY_STATES } from '../../handlers/PivotalHandler';
import Owners from '../../components/Owners';
import Labels from '../../components/Labels';
import ProjectPicker from '../../components/ProjectPicker';
import Iterations from '../../components/Iterations';
import Column from '../../components/Column';

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Projects = (): JSX.Element => {
  const { apiToken } = parseCookies();
  const router = useRouter();
  const { id }: UrlParams = router.query;
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const { setVisible: setIsModalVisible, bindings } = useModal();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({});
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
    setFilters({ ...filters, [name]: [...filters[name].filter((element: any): boolean => element !== filter)] });
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      const pivotal = new PivotalHandler();
      const stories = await pivotal.fetchProjectStories({ apiToken, projectId: id });

      dispatch(addStories({ id, stories }));
    };
    getStories();
  }, [id]);

  const [{ isLoading }, changeEstimate] = useAsync(async () => {
    const newStory: Story = { ...selectedStory, estimate: Number(selectedEstimate) };
    dispatch(editStory({ projectId: id, story: newStory, storyState: selectedStory?.state }));
    const pivotal = new PivotalHandler();
    await pivotal.updateStory({
      apiToken,
      projectId: id,
      storyId: selectedStory?.id,
      payload: { estimate: Number(selectedEstimate) },
    });

    setIsModalVisible(false);
  });

  const estimateChangeHandler = (value: string): void => setSelectedEstimate(value);

  const [, onDragEnd] = useAsync(async (result: DragDropContext.result) => {
    console.log('result', result);
    console.log('stories', stories);
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
      setSelectedStory(stories[sourceState][draggableId]);
      setIsModalVisible(true);
      return;
    }

    const destinationState = STORY_STATES[destinationDroppableId];

    dispatch(moveStory({ projectId: id, sourceState, sourceIndex, destinationState, destinationIndex }));

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
    await pivotal.updateStory({ apiToken, projectId: id, storyId: draggableId, payload });
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
      <Row gap={0.8}>
        <ProjectPicker id={id} />
        <Iterations
          id={id}
          selectedIteration={filters.iteration}
          addIteration={addFilter}
          removeIteration={removeFilter}
        />
        <Labels labels={filters.labels} onClick={removeFilter} />
        <Owners owners={filters.owners} onClick={removeFilter} />
      </Row>

      <Row gap={0.8}>
        {loading && <Loading />}
        <Spacer y={0.8} />
        {!loading && (
          <DragDropContext onDragEnd={onDragEnd}>
            {STORY_STATES.map((state: string, idx: number) => (
              <Column key={state} state={state} idx={idx} stories={stories[state]} addFilter={addFilter} />
            ))}
          </DragDropContext>
        )}
      </Row>
      <Modal {...bindings}>
        <Modal.Title>{selectedStory?.name}</Modal.Title>
        <Modal.Subtitle>Change Story Estimate</Modal.Subtitle>
        <Modal.Content>
          <CenteredDiv>
            <Text h5> Select the amount of effort points of this story.</Text>
            <Radio.Group value={selectedEstimate} onChange={estimateChangeHandler} useRow>
              {[...new Array(6)].map((_, index: number) => {
                const pointValue = index > 3 ? index + 2 * (index - 4) + 1 : index;
                return (
                  <Radio key={index} value={String(pointValue)}>
                    {pointValue}
                  </Radio>
                );
              })}
            </Radio.Group>
          </CenteredDiv>
        </Modal.Content>
        <Modal.Action passive onClick={() => setIsModalVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={isLoading}
          onClick={() => {
            changeEstimate();
            setSelectedStory(null);
          }}
        >
          Submit
        </Modal.Action>
      </Modal>
    </div>
  );
};

export default Projects;
