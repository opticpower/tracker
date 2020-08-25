import { GeistProvider, CssBaseline } from '@geist-ui/react';

const MyApp = ({ Component, pageProps }) => {
  return (
    <GeistProvider theme={{ type: 'dark' }}>
      <CssBaseline />
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};
export default MyApp;
