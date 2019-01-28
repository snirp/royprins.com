import React from 'React';
import './style.css';
import styled from '@emotion/styled';

import Menu from '../SideMenu/Menu';


export default (props) => (
  <div>
    { props.children }
    <Menu>
      <ul>
        <li>hoi</li>
        <li>dag</li>
      </ul>
    </Menu>
  </div>
);

