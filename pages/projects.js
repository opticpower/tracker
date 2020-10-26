import { Page, Spacer, Text } from '@geist-ui/react';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProjectPicker from '../components/ProjectPicker';
import PivotalHandler from '../handlers/PivotalHandler';
import { usePivotal } from '../hooks';
import { redirectIfNoApiKey } from '../redirects';
import { setUser } from '../redux/actions/user.actions';
import { wrapper } from '../redux/store';

const Projects = () => {
  const dispatch = useDispatch();
  const stateUser = useSelector(state => state.user);

  const [, getUser] = usePivotal(async ({ apiKey }) => {
    const user = await PivotalHandler.getUser({ apiKey });
    dispatch(setUser(user));
  });

  useEffect(() => {
    if (!stateUser || !Object.keys(stateUser).length) {
      getUser();
    }
  }, []);

  return (
    <Page>
      <Head>
        <title>Choose Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text h1>Choose your project Wisely</Text>
      <Spacer y={1.5} />
      <ProjectPicker />
    </Page>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(redirectIfNoApiKey);

export default Projects;
