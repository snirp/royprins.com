import React from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  z-index: 77;
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.maximized ? '100%' : 0};
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: ${props => props.maximized ? 1 : 0};
  transition: opacity 0.3s;
`;

const Slide = styled.nav`
  z-index: 88;
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  background-color: white;
  transition: width 0.3s;
  width: ${props => props.maximized ? '95%': '0'};
  overflow: auto;
`;

const Toggle = styled.button`
  z-index: 99;
  position: fixed;
  top: 10px;
  right: 20px;
  padding: 0;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
`;

const compressPartial = `
  width: 0;
  left: 50%;
`

const Burger = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  div {
    position: absolute;
    box-shadow: 0 0 2px 0px white;
    height: 4px;
    width: 100%;
    background: black;
    border-radius: 99px;
    left: 0;
    transition: all .3s;
  }
  div:nth-of-type(1){ 
    top: 10%;
    ${props => props.maximized && compressPartial}
  }
  div:nth-of-type(2){ 
    top: 50%;
    margin-top: calc(4px/-2);
    transform: ${props => props.maximized ? 'rotate(45deg)' : 'rotate(0)'};
  }
  div:nth-of-type(3){
    top: 50%;
    margin-top: calc(4px/-2);
    box-shadow: none;
    transform: ${props => props.maximized ? 'rotate(-45deg)' : 'rotate(0)'};
  }
  div:nth-of-type(4){
    bottom: 10%;
    ${props => props.maximized && compressPartial}
  }
`

export default class Layout extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      maximized: false,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  selfRef = React.createRef();

  handleClickOutside = e => {
    if (this.state.maximized && !this.selfRef.current.contains(e.target)) {
      console.log(e.target)
      this.setState({ maximized: false });
    }
  };

  handleToggle = e => { 
    this.setState(previousState => {return {maximized: !previousState.maximized}});
  }

  render(){
    return (
      <div>
        <Overlay maximized={this.state.maximized} />
        <Slide maximized={this.state.maximized} ref={this.selfRef}>
          {this.props.children}
          <Toggle 
            maximized={this.state.maximized} 
            onClick={this.handleToggle} 
            style={{height: "32px", width: "32px"}}
          >
            <Burger maximized={this.state.maximized}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </Burger>
          </Toggle>
        </Slide>

      </div>
    );
  }
}