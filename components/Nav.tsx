import styled from 'styled-components';
import { Row, Col, Spacer, Select } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../redux/types';
import { changeTheme } from '../redux/actions/settings.actions';

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

const Nav = (): JSX.Element => {
  const theme = useSelector((state: State): string => state.settings.theme);
  const dispatch = useDispatch();

  return (
    <NavBar>
      <Col>
        <Logo src={theme === 'light' ? darkLogo : lightLogo} alt="OpticPower" />
      </Col>
      <SelectContainer>
        <Select placeholder={theme === 'light' ? 'Light Mode' : 'Dark Mode'}>
          <Select.Option value="Dark Mode" onClick={(): void => dispatch(changeTheme('dark'))}>
            <Moon size={16} /> <Spacer inline x={0.35} />
            Dark Mode
          </Select.Option>
          <Select.Option value="Light Mode" onClick={(): void => dispatch(changeTheme('light'))}>
            <Sun size={16} /> <Spacer inline x={0.35} />
            Light Mode
          </Select.Option>
        </Select>
      </SelectContainer>
    </NavBar>
  );
};

export default Nav;
