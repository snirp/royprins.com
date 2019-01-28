import React from 'React';
import styled from '@emotion/styled';

const ToggleButton = styled.button`
  border: none;
  outline: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 99;
  color: ${props => props.maximized ? 'red' : 'blue'};
`;

export default ({maximized, onClick}) => (
  <ToggleButton maximized={maximized} onClick={onClick}>
    {maximized && 'open'}
    X
  </ToggleButton>
);