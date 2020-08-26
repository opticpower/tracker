import React, { useState, FC } from 'react';
import { GeistProvider, CssBaseline, Text, Row, Col, Spacer, ButtonDropdown } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';

const OpticTracker: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
  const [useLight, setUseLight] = useState<boolean>(false);

  return (
    <GeistProvider theme={{ type: useLight ? 'light' : 'dark' }}>
      <CssBaseline />
      <Row>
        <Col>
          <Spacer x={1} />
          <Text h5>Optic Tracker</Text>
        </Col>
        <Col align="right">
          <ButtonDropdown size="mini" auto>
            <ButtonDropdown.Item main={useLight === false} onClick={(): void => setUseLight(false)}>
              <Moon size={16} /> <Spacer inline x={0.35} />
              Dark Mode
            </ButtonDropdown.Item>
            <ButtonDropdown.Item main={Boolean(useLight)} onClick={(): void => setUseLight(true)}>
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
export default wrapper.withRedux(OpticTracker);
