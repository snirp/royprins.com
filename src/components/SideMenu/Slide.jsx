import React from 'React';
import styled from '@emotion/styled';

const NavMenu = styled.nav`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  background-color: white;
  transition: width 0.5s;
  width: ${props => props.maximized ? '80%': '10%'};
`;

export default ({children, maximized}) => (
  <NavMenu maximized={maximized}>
    {children}
  </NavMenu>
);