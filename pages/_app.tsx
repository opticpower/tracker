import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { useTheme } from '@geist-ui/react';
import { AppProps } from 'next/app';
import { parseCookies } from 'nookies';
import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as SCThemeProvider } from 'styled-components';

import Nav from '../components/Nav';
import { setApiKey, setTheme } from '../redux/actions/settings.actions';
import { getTheme } from '../redux/selectors/settings.selectors';
import { wrapper } from '../redux/store';
import { darkTheme, lightTheme } from '../themes';

const OpticTracker = ({ Component, pageProps }: AppProps): JSX.Element => {
  const selectedTheme = useSelector(getTheme);
  const theme = selectedTheme === 'light' ? lightTheme : darkTheme;
  const scTheme = useTheme();
  return (
    <GeistProvider theme={theme}>
      <SCThemeProvider theme={scTheme}>
        <CssBaseline />
        <Nav />
        <Component {...pageProps} toggleLight />
      </SCThemeProvider>
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
