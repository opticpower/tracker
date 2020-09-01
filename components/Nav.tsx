import styled from 'styled-components';
import { Row, Col, Spacer, Select } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';

const opticLogo = '/images/OpticPower.png';

const NavBar = styled(Row)`
  align-items: center !important;
  height: 50px;
  border-bottom: 0.5px solid;
  margin-bottom: 15px;
  padding: 0px 15px;
`;

const Logo = styled.img`
  filter: drop-shadow(0 0 1px white);
  height: 45px;
`;

const SelectContainer = styled(Col)`
  text-align: right;
`;

interface themeMode {
  setUseLight(useLight: boolean): any;
  useLight: boolean;
}

const Nav = ({ useLight, setUseLight }: themeMode): JSX.Element => {
  return (
    <NavBar>
      <Col>
        <Logo src={opticLogo} alt="OpticPower" />
      </Col>
      <SelectContainer>
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
      </SelectContainer>
    </NavBar>
  );
};

export default Nav;
