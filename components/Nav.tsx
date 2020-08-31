import { Row, Col, Spacer, Select } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';

const opticLogo = '/images/OpticPower.png';

const Nav = ({ useLight, setUseLight }): JSX.Element => {
  return (
    <Row className="nav">
      <style jxs>
        {`
        .nav {
          align-items: center !important;
          height: 50px;
          border-bottom: 0.5px solid;
          margin-bottom: 15px;
          padding: 0px 15px
        }
        .logo {
          filter: drop-shadow(0 0 1px white);
          height: 45px;
        }
      `}
      </style>
      <Col>
        <img className="logo" src={opticLogo} alt="OpticPower" />
      </Col>
      <Col align="right">
        <Select placeholder={useLight ? 'Light Mode' : 'Dark Mode'}>
          <Select.Option value="Dark Mode" onClick={(): void => setUseLight(false)}>
            <Moon size={16} /> <Spacer inline x={0.35} />
            Dark Mode
          </Select.Option>
          <Select.Option value="Light Mode" onClick={(): void => setUseLight(true)}>
            <Sun size={16} /> <Spacer inline x={0.35} />
            Light Mode
          </Select.Option>
        </Select>
      </Col>
    </Row>
  );
};

export default Nav;
