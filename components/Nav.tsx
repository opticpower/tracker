import styled from 'styled-components';
import { Row, Col, Spacer, Select } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';

const darkLogo = '/images/opticDarkLogo.png';
const lightLogo = '/images/opticLightLogo.png';

const NavBar = styled(Row)`
  align-items: center !important;
  height: 50px;
  border-bottom: ${(props) => `0.5px solid ${props.theme.palette.border}`};
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

interface NavParams {
  setUseLight(useLight: boolean): any;
  useLight: boolean;
}

const Nav = ({ useLight, setUseLight }: NavParams): JSX.Element => {
  return (
    <NavBar>
      <Col>
        <Logo src={useLight ? darkLogo : lightLogo} alt='OpticPower' />
      </Col>
      <SelectContainer>
        <Select
          value={`${Number(useLight)}`}
          onChange={(val) => setUseLight(!!Number(val))}
        >
          <SelectOption value='0'>
            <Moon size={16} />
            <Spacer inline x={0.35} />
            Dark Mode
          </SelectOption>
          <SelectOption value='1'>
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
