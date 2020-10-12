import styled from 'styled-components';
import { Row, Col, Spacer, Select } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/actions/settings.actions';
import { getTheme } from '../redux/selectors/settings.selectors';

const darkLogo = '/images/opticDarkLogo.png';
const lightLogo = '/images/opticLightLogo.png';

const NavBar = styled(Row)`
  align-items: center !important;
  height: 50px;
  border-bottom: ${props => `0.5px solid ${props.theme.palette.border}`};
  padding: 0px 15px;
`;

const Logo = styled.img`
  height: 40px;
`;

const SelectContainer = styled(Col)`
  text-align: right;
`;

const SelectOption = styled(Select.Option)`
  & > span {
    display: flex;
    align-items: center;
  }
`;

const Nav = (): JSX.Element => {
  const theme = useSelector(getTheme);
  const dispatch = useDispatch();

  return (
    <NavBar>
      <Col>
        <Logo src={theme === 'light' ? darkLogo : lightLogo} alt="OpticPower" />
      </Col>
      <SelectContainer>
        <Select value={`${Number(theme === 'light')}`} onChange={setTheme}>
          <SelectOption value="dark">
            <Moon size={16} />
            <Spacer inline x={0.35} />
            Dark Mode
          </SelectOption>
          <SelectOption value="light">
            <Sun size={16} />
            <Spacer inline x={0.35} />
            Light Mode
          </SelectOption>
        </Select>
      </SelectContainer>
    </NavBar>
  );
};

export default Nav;
