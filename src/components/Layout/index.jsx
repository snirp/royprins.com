import React from 'React';
import './style.css';

import SideMenu from '../SideMenu';
import { isAbsolute } from 'path';


export default (props) => (
  <div>
    { props.children }
    <SideMenu>
      <ul>
        <li>hoi</li>
        <li>dag</li>
        <li>hoi</li>
        <li>dag</li>
        <li>hoi</li>
        <li>dag</li>
        <li>hoi</li>
        <li>dag</li>
      </ul>
    </SideMenu>
  </div>
);
