import React from 'React';
import styled from '@emotion/styled';

const Slide = styled.nav`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  background-color: white;
  transition: width 0.5s;
  width: ${props => props.maximized ? '80%': '0'};
`;

const Toggle = styled.button`
  border: none;
  outline: none;
  position: fixed;
  background-color: transparent;
  top: 10px;
  left: 10px;
  z-index: 99;
  color: ${props => props.maximized ? 'red' : 'blue'};
`;

export default class Layout extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      maximized: false,
    };
  }

  handleToggle = (e) => { 
    this.setState({maximized: !this.state.maximized});
  }

  render(){
    return (
      <div>
        <Slide maximized={this.state.maximized}>
          {this.props.children}
        </Slide>
        <Toggle maximized={this.state.maximized} onClick={this.handleToggle}>x</Toggle>
      </div>
    );
  }
}