import { Button, Card, Input, Note, Page, Spacer, Text } from '@geist-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setApiKey } from '../redux/actions/settings.actions';
import { getApiKey } from '../redux/selectors/settings.selectors';

const Home = () => {
  const [key, setKey] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const apiKey = useSelector(getApiKey);

  //a client side only redirect since user can enter in api token.
  if (Boolean(apiKey) && typeof window !== 'undefined') {
    router.push('/projects');
  }

  return (
    <Page>
      <Head>
        <title>Optic x Pivotal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text h1>Optic x Pivotal</Text>
      <Spacer y={1.5} />
      <Card shadow>
        <Note type="success">
          To get your API Token, go to{' '}
          <a href="https://www.pivotaltracker.com/profile">Your pivotal profile</a>
        </Note>
        <Spacer y={1} />
        Please input your pivotal token below:
        <Spacer y={1} />
        <Input size="large" placeholder="API Token" onChange={(e) => setKey(e.target.value)} />
        <Button auto type="secondary" size="medium" onClick={() => dispatch(setApiKey(key))}>
          Login
        </Button>
      </Card>
    </Page>
  );
};

export default Home;
