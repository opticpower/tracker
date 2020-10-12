import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';
import Nav from '../components/Nav';
import { useSelector } from 'react-redux';
import { parseCookies } from 'nookies';
import { setTheme, setApiKey } from '../redux/actions/settings.actions';
import { getTheme } from '../redux/selectors/settings.selectors';
import { lightTheme, darkTheme } from '../themes';
import { ThemeProvider as SCThemeProvider } from 'styled-components';

const OpticTracker = ({ Component, pageProps }: AppProps): JSX.Element => {
  const selectedTheme = useSelector(getTheme);
  const theme = selectedTheme === 'light' ? lightTheme : darkTheme;
  return (
    <GeistProvider theme={theme}>
      <SCThemeProvider theme={theme}>
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
