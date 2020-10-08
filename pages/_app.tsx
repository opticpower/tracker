import React, { useState, FC } from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';
import Nav from '../components/Nav';
import { State } from '../redux/types';

import { useSelector } from 'react-redux';

const OpticTracker: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
  const theme = useSelector((state: State): string => state.settings.theme);

  return (
    <GeistProvider theme={{ type: theme }}>
      <CssBaseline />
      <Nav />
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};
export default wrapper.withRedux(OpticTracker);
