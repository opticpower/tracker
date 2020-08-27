import { useEffect, Fragment, useState } from 'react';
import { Text, Spacer, Row, Col, Card, Divider, Loading, Badge, User, Tag, Breadcrumbs } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { subDays } from 'date-fns';
import ProjectPicker from '../../components/ProjectPicker';
import { useSelector, useDispatch } from 'react-redux';
import { State, Story, Filters, Label, Owner } from '../../redux/types';
import { addStories } from '../../redux/actions/stories.actions';
import { filterStories } from '../../redux/selectors/stories.selectors';
import Owners from '../../components/Owners';
import Labels from '../../components/Labels';

const states = ['Unscheduled', 'Unstarted', 'Started', 'Finished', 'Delivered', 'Rejected', 'Accepted'];

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

      dispatch(
        addStories({
          id,
          stories,
        })
      );
    };
    getStories();
  }, [id]);

  const loading = !Boolean(stories && Object.values(stories).length);

  return (
    <Fragment>
      <Row gap={0.8}>
        <ProjectPicker id={id} />
        <Labels labels={filters.labels} onClick={removeFilter} />
        <Owners owners={filters.owners} onClick={removeFilter} />
      </Row>

      <Row gap={0.8}>
        {loading && <Loading />}
        <Spacer y={0.8} />
        {!loading &&
          states.map(state => (
            <Col key={state}>
              <Text h3>{state}</Text>
              {(stories[state] || []).map(
                (story: Story): JSX.Element => (
                  <Fragment key={story.id}>
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
                  </Fragment>
                )
              )}
            </Col>
          ))}
      </Row>
    </Fragment>
  );
};

export default Projects;
