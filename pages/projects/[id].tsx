import { useEffect, Fragment, useState } from 'react';
import { Text, Spacer, Row, Col, Card, Divider, Loading, Badge, User, Tag, Breadcrumbs } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { subDays } from 'date-fns';
import ProjectPicker from '../../components/ProjectPicker';
import { useSelector, useDispatch } from 'react-redux';
import { State, Story, Filters, Label } from '../../redux/types';
import { addStories } from '../../redux/actions/stories.actions';
import { filterStories } from '../../redux/selectors/stories.selectors';

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

  const addFilter = (name: string, filter: any): void => {
    const array = [...(filters[name] || []), filter];
    setFilters({ ...filters, [name]: Array.from(new Set(array)) });
  };

  const getType = name => {
    if (name === 'medium' || name === 'med') {
      return 'warning';
    }

    if (name === 'optic') {
      return 'secondary';
    }

    if (name === 'high') {
      return 'error';
    }
    return 'default';
  };

  const getBorderColor = type => {
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

      console.log('setting stories', stories);
      dispatch(
        addStories({
          id,
          stories,
        })
      );
    };
    getStories();
  }, [id]);

  console.log('have filter', filters);
  console.log('have stories', stories);

  const loading = !Boolean(stories && Object.values(stories).length);
  console.log('have loading', loading);

  return (
    <Fragment>
      <Row gap={0.8}>
        <ProjectPicker id={id} />
        {filters.labels?.map(
          (label: Label): JSX.Element => (
            <Tag key={label.name} type={getType(label.name)} invert>
              {label.name}
              <Spacer x={0.8} />
            </Tag>
          )
        )}
      </Row>

      <Row gap={0.8}>
        {loading && <Loading />}
        <Spacer y={0.8} />
        {!loading &&
          states.map(state => (
            <Col key={state}>
              <Text h3>{state}</Text>
              {(stories[state] || []).map(story => (
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
                      {story.owners.map(owner => (
                        <Fragment key={owner.name}>
                          <User name={owner.name} text={owner.initials.toUpperCase()} />
                          <Spacer y={1} />
                        </Fragment>
                      ))}
                      {story.labels.map(label => (
                        <Fragment key={label.id}>
                          <Tag type={getType(label.name)} onClick={() => addFilter('labels', label)} invert>
                            {label.name}
                          </Tag>
                          <Spacer y={1} />
                        </Fragment>
                      ))}
                      Add Github, Blockers
                    </Card.Content>
                  </Card>
                  <Spacer y={1} />
                </Fragment>
              ))}
            </Col>
          ))}
      </Row>
    </Fragment>
  );
};

export default Projects;
