import { useState } from 'react';
import Head from 'next/head';
import { Page, Text, Card, Note, Spacer, Input, Button } from '@geist-ui/react';
import { setCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const Home = () => {
  const [apiToken, setApiToken] = useState('');
  const cookies = parseCookies();
  const router = useRouter();

  if (Boolean(cookies.apiToken)) {
    router.push('/projects');
  }

  const letsLogin = () => {
    setCookie(null, 'apiToken', apiToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    router.push('/projects');
  };

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
          To get your API Token, go to <a href="https://www.pivotaltracker.com/profile">Your pivotal profile</a>
        </Note>
        <Spacer y={1} />
        Please input your pivotal token below:
        <Spacer y={1} />
        <Input size="large" placeholder="API Token" onChange={e => setApiToken(e.target.value)} />
        <Button auto type="secondary" size="medium" onClick={letsLogin}>
          Login
        </Button>
      </Card>
    </Page>
  );
};

export default Home;
