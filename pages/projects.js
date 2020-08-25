import Head from 'next/head';
import { Page, Text, Spacer } from '@geist-ui/react';
import ProjectPicker from '../components/ProjectPicker';

const Projects = () => {
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

export default Projects;
