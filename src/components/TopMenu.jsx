import React from 'react';

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
    const menuStyle = {
      position: 'fixed',
      top: this.state.visible ? '0' : '-60px',
      width: '100%',
      height: '50px',
      backgroundColor: 'white',
      color: 'black',
      transition: 'top 0.2s',
      boxShadow: '0 3px 3px rgba(0,0,0,0.23)',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 20px',
      zIndex: 10,
    }

    return(
      <div style={menuStyle}>
        {this.props.children}
      </div>
    );
  }
}
