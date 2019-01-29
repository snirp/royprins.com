import React from 'react';
import styled from '@emotion/styled'

import logo from '../resources/img/rp.svg';

const Menu = styled.div`
  position: fixed;
  top: ${props => props.visible ? "0" : "-55px"};
  width: 100%;
  height: 50px;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: black;
  transition: top 0.2s;
  box-shadow: 0 3px 3px rgba(0,0,0,0.23);
  z-index: 10;
  div {
    margin: 0 10px;
  }
`

export default class TopMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount = function() {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount = function() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  lastPosition = 0;

  handleScroll = e => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop < this.lastPosition && scrollTop > 600) {
      // Prevent setState (and re-render) when value doesn't change
      !this.state.visible && this.setState({ visible: true })
    } else {
      this.state.visible && this.setState({ visible: false })
    }
    this.lastPosition = scrollTop;
  };

  render(){
    return(
      <Menu visible={this.state.visible}>
        <div style={{width: '40px'}}><img src={logo} alt="Logo" /></div>
        {this.props.children}
        <div style={{width: '32px'}} />
      </Menu>
    );
  }
}
