import { useState } from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import Nav from '../components/Nav';

const MyApp = ({ Component, pageProps }) => {
  const [useLight, setUseLight] = useState(false);

  return (
    <GeistProvider theme={{ type: useLight ? 'light' : 'dark' }}>
      <CssBaseline />
      <Nav useLight={useLight} setUseLight={setUseLight} />
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};
export default MyApp;
