import { useEffect, useState, Fragment } from 'react';
import { Text, Spacer, Row, Col, Card, Divider } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { subDays } from 'date-fns';
import ProjectPicker from '../../components/ProjectPicker';

const states = ['Unscheduled', 'Unstarted', 'Planned', 'Started', 'Finished', 'Delivered', 'Rejected', 'Accepted'];

const Projects = () => {
  const { apiToken } = parseCookies();
  const [stories, setStories] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    const getStories = async () => {
      let stories = {};
      for (const state of states) {
        let fetchString = `stories?limit=500&with_state=${state}`;

        if (state === 'accepted') {
          const twoWeeksAgo = subDays(new Date(), 14);
          fetchString = `${fetchString}&accepted_after=${twoWeeksAgo.getTime()}`;
        }

        const request = await fetch(`https://www.pivotaltracker.com/services/v5/projects/${id}/${fetchString}`, {
          headers: {
            'X-TrackerToken': apiToken,
          },
        });
        stories = { ...stories, [state]: await request.json() };
      }
      setStories(stories);
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
        {states.map(state => (
          <Col gap={0.8} key={state}>
            <Text h3>{state}</Text>
            {(stories[state] || []).map(story => (
              <Fragment key={story.id}>
                <Card width="250px">
                  <Card.Content>
                    <Text b>{story.name}</Text>
                  </Card.Content>
                  <Divider y={0} />
                  <Card.Content>Todo: Add picture of Owner & also add Github</Card.Content>
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
