import { Col, Loading, Row } from '@geist-ui/react';
import { useTheme } from '@geist-ui/react';
import { subDays } from 'date-fns';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Column from '../../components/Column';
import IterationPicker from '../../components/IterationPicker';
import Labels from '../../components/Labels';
import Owners from '../../components/Owners';
import ProjectPicker from '../../components/ProjectPicker';
import StoryModal from '../../components/StoryModal';
import { useAsync } from '../../hooks';
import { redirectIfNoApiKey } from '../../redirects';
import { addStories, moveStory } from '../../redux/actions/stories.actions';
import { getApiKey } from '../../redux/selectors/settings.selectors';
import { filterStories } from '../../redux/selectors/stories.selectors';
import { wrapper } from '../../redux/store';
import { Filters, Iteration, Label, Owner, State, Story } from '../../redux/types';
import { spacing } from '../../styles';

const states = [
    'unscheduled',
    'unstarted',
    'started',
    'finished',
    'delivered',
    'rejected',
    'accepted'
];

interface Params {
    id?: string;
}

const Container = styled.div(({ color, image }) => ({
    overflow: 'auto',
    overflowX: 'auto',
    backgroundColor: color,
    backgroundImage: `url(/images/grid-${image}.png)`,
    height: '100%',
    minHeight: 1024,
    paddingTop: spacing(3)
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
    const { id }: Params = router.query;
    const dispatch = useDispatch();
    const [filters, setFilters] = useState<Filters>({});
    const [selectedStory, setSelectedStory] = useState<Story>();
    const apiKey = useSelector(getApiKey);
    const stories = useSelector(
        (state: State): Record<string, Story[]> => filterStories(state, id, filters)
    );

    const getFilterArray = (filters: Owner[] | Label[] = [], filter: Owner | Label) => {
        if (filters.find((f) => f.name === filter.name)) {
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
            [name]: [...filters[name].filter((element: any): boolean => element !== filter)]
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
            let stories = {};

            //todo: we should do Promise.all for these
            for (const state of states) {
                let fetchString = `stories?limit=500&with_state=${state}&fields=name,estimate,owners,labels,blockers,reviews,story_type,description`;
                if (state === 'Accepted') {
                    const oneWeekAgo = subDays(new Date(), 7);
                    fetchString = `${fetchString}&accepted_after=${oneWeekAgo.getTime()}`;
                }

                const request = await fetch(
                    `https://www.pivotaltracker.com/services/v5/projects/${id}/${fetchString}`,
                    {
                        headers: {
                            'X-TrackerToken': apiKey
                        }
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
            destination: { droppableId: destinationDroppableId, index: destinationIndex },
            draggableId
        } = result;

        if (!destination) {
            return;
        }

        if (destinationDroppableId === sourceDroppableId && destinationIndex === sourceIndex) {
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
                destinationIndex
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
            after_id: stories[destinationState][landingIndex - 1]?.id || null
            // A null after_id means the story was placed last in the list.
        };
        await fetch(
            `https://www.pivotaltracker.com/services/v5/projects/${id}/stories/${draggableId}`,
            {
                method: 'PUT',
                headers: {
                    'X-TrackerToken': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...payload })
            }
        );
    });

    const loading = !(stories && Object.values(stories).length);
    const { palette, type } = useTheme();

    return (
        <Container color={palette.accents_1} image={type}>
            <StoryModal isOpen={Boolean(selectedStory)} story={selectedStory} close={closeStory} />
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
                {loading && (
                    <Col>
                        <Loading />
                    </Col>
                )}
                {!loading && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        {states.map((state: string, idx: number) => (
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
        </Container>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(redirectIfNoApiKey);

export default Project;
