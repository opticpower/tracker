import styled from 'styled-components';
import { Row, Col, Spacer, Select } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';

const darkLogo = '/images/opticDarkLogo.png';
const lightLogo = '/images/opticLightLogo.png';

const NavBar = styled(Row)`
  align-items: center !important;
  height: 50px;
  border-bottom: 0.5px solid;
  padding: 0px 15px;
`;

const Logo = styled.img`
  height: 40px;
`;

const SelectContainer = styled(Col)`
  text-align: right;
`;

interface NavParams {
  setUseLight(useLight: string): any;
  useLight: string;
}

const Nav = ({ useLight, setUseLight }: NavParams): JSX.Element => {
  return (
    <NavBar>
      <Col>
        <Logo src={useLight === 'light' ? darkLogo : lightLogo} alt="OpticPower" />
      </Col>
      <SelectContainer>
        <Select placeholder={useLight === 'light' ? 'Light Mode' : 'Dark Mode'}>
          <Select.Option value="Dark Mode" onClick={(): void => setUseLight('dark')}>
            <Moon size={16} /> <Spacer inline x={0.35} />
            Dark Mode
          </Select.Option>
          <Select.Option value="Light Mode" onClick={(): void => setUseLight('light')}>
            <Sun size={16} /> <Spacer inline x={0.35} />
            Light Mode
          </Select.Option>
        </Select>
      </SelectContainer>
    </NavBar>
  );
};

export default Nav;
