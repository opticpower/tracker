import { NextApiResponse } from 'next';
import { Store } from 'redux';
import { GetServerSidePropsContext } from 'next-redux-wrapper';

/** provids a server side redirect if you have no api key */
export async function redirectIfNoApiKey(
  context: GetServerSidePropsContext & {
    store: Store;
  }
): Promise<void> {
  const { store, res } = context;

  const state = store.getState();

  if (!Boolean(state?.settings?.apiKey)) {
    res.writeHead(301, {
      Location: '/',
    });
    res.end();
  }
}
