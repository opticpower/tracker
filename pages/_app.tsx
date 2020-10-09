import React, { useState, FC } from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';
import Nav from '../components/Nav';
import { lightTheme, darkTheme } from '../themes';

import { setCookie, parseCookies } from 'nookies';

const OpticTracker: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
  const [useLight, setUseLight] = useState<boolean>(false);
  const theme = useLight ? lightTheme : darkTheme;

  return (
    <GeistProvider theme={theme}>
      <CssBaseline />
      <Nav useLight={useLight} setUseLight={setUseLight} />
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};
export default wrapper.withRedux(OpticTracker);
