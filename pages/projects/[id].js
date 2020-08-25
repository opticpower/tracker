import { useEffect, useState, Fragment } from 'react';
import { Text, Spacer, Row, Col, Card, Divider, Loading, Badge, User } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { subDays } from 'date-fns';
import ProjectPicker from '../../components/ProjectPicker';

const states = ['Unscheduled', 'Unstarted', 'Planned', 'Started', 'Finished', 'Delivered', 'Rejected', 'Accepted'];

const Projects = () => {
  const { apiToken } = parseCookies();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      let stories = {};
      for (const state of states) {
        let fetchString = `stories?limit=500&with_state=${state}&fields=name,estimate,owners`;
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
      setStories(stories);
      setLoading(false);
    };
    getStories();
  }, [id]);

  console.log('have stories', stories);

  return (
    <Fragment>
      <Row gap={0.8}>
        <ProjectPicker id={id} />
      </Row>

      <Row gap={0.8}>
        {loading && <Loading />}
        <Spacer y={0.8} />
        {!loading &&
          states.map(state => (
            <Col gap={0.8} key={state}>
              <Text h3>{state}</Text>
              {(stories[state] || []).map(story => (
                <Fragment key={story.id}>
                  <Card width="250px">
                    <Card.Content>
                      {Number.isInteger(story.estimate) && <Badge>{story.estimate}</Badge>}
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
                      Add Github, Blockers, Tags
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
