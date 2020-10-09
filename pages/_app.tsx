import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';
import Nav from '../components/Nav';
import { useSelector } from 'react-redux';
import { parseCookies } from 'nookies';
import { setTheme, setApiKey } from '../redux/actions/settings.actions';
import { getTheme } from '../redux/selectors/settings.selectors';

const OpticTracker = ({ Component, pageProps }: AppProps): JSX.Element => {
  const theme = useSelector(getTheme);

  return (
    <GeistProvider theme={{ type: theme }}>
      <CssBaseline />
      <Nav />
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};

OpticTracker.getInitialProps = async ({ ctx }) => {
  const { apiKey, theme } = parseCookies(ctx);
  ctx?.store?.dispatch(setTheme(theme || 'dark'));
  if (apiKey) {
    ctx?.store?.dispatch(setApiKey(apiKey));
  }
};

export default wrapper.withRedux(OpticTracker);
