import React, { useState, FC } from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';
import Nav from '../components/Nav';

import { setCookie, parseCookies } from 'nookies';

const OpticTracker: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
  const { useLight = 'dark' } = parseCookies();
  const [_, setRefresh] = useState<number>();

  const setTheme = (theme: string) => {
    setCookie(null, 'useLight', theme, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    setRefresh(Math.random()); //this will refresh state since cookies doesnt
  };

  return (
    <GeistProvider theme={{ type: useLight }}>
      <CssBaseline />
      <Nav useLight={useLight} setUseLight={setTheme} />
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};
export default wrapper.withRedux(OpticTracker);
