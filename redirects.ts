import { NextApiResponse } from 'next';
import { GetServerSidePropsContext } from 'next-redux-wrapper';
import { Store } from 'redux';

/** provids a server side redirect if you have no api key */
export async function redirectIfNoApiKey(
  context: GetServerSidePropsContext & {
    store: Store;
  }
): Promise<void> {
  const { store, res } = context;

  const state = store.getState();

  if (!state?.settings?.apiKey) {
    res.writeHead(301, {
      Location: '/',
    });
    res.end();
  }
}

export async function redirectIfApiKeyExists(
  context: GetServerSidePropsContext & {
    store: Store;
  }
): Promise<void> {
  const { store, res } = context;

  const state = store.getState();

  if (state?.settings?.apiKey) {
    res.writeHead(301, {
      Location: '/projects',
    });
    res.end();
  }
}
