import { useState } from 'react';
import { GeistProvider, CssBaseline, Text, Row, Col, Spacer, ButtonDropdown } from '@geist-ui/react';
import { CloudLightning, Sun, Moon } from '@geist-ui/react-icons';

const MyApp = ({ Component, pageProps }) => {
  const [useLight, setUseLight] = useState(false);

  return (
    <GeistProvider theme={{ type: useLight ? 'light' : 'dark' }}>
      <CssBaseline />
      <Row>
        <Col>
          <Text h5>Optic Tracker</Text>
        </Col>
        <Col align="right">
          <ButtonDropdown size="mini" auto>
            <ButtonDropdown.Item main={useLight === false} onClick={() => setUseLight(false)}>
              <Moon size={16} /> <Spacer inline x={0.35} />
              Dark Mode
            </ButtonDropdown.Item>
            <ButtonDropdown.Item main={Boolean(useLight)} onClick={() => setUseLight(true)}>
              <Sun size={16} /> <Spacer inline x={0.35} />
              Light Mode
            </ButtonDropdown.Item>
          </ButtonDropdown>
        </Col>
      </Row>
      <Component {...pageProps} toggleLight />
    </GeistProvider>
  );
};
export default MyApp;
