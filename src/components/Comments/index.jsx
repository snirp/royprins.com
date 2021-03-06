import React from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

import Comment from '../Comment';
import Centered from '../Centered';
import styles from './Comments.module.css';


const SubmitButton = styled.button`
  border: none;
  display: block;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  padding: 0.8rem;
  margin: 0.8rem 0;
  background-color: green;
  transition: background-color 0.5s;
  &:disabled {
    background-color: grey;
  }
`;

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      submitting: false,
      submitted: false,
      name: '',
      email: '',
      message: ''
    };
  }

  seemsValid = () => {
    switch(true){
    case this.state.name.length < 2:
      return false;
    case !/\S+@\S+\.\S+/.test(this.state.email):
      return false;
    case this.state.message.length < 2:
      return false;
    default:
      return true;
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value}, () => {
      this.setState({ disabled: !this.seemsValid() });
    });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({submitting: true});
    axios.post('https://dev.staticman.net/v3/entry/github/snirp/royprins.com/master/comments', {
      fields: {
        slug: this.props.slug,
        name: this.state.name,
        email: this.state.email,
        message: this.state.message,
      }
    })
      .then(res => {
        this.setState({submitting: false});
        this.setState({submitted: true});
      })
      .catch((error) => {
        this.setState({submitting: false});
      });
  }

  render() {
    return(
      <Centered bg="slategrey" color="white">
        { this.state.submitted 
          ?( <Comment name={this.state.name} date={new Date()} message={this.state.message}/> )
          :(
            <form onSubmit={this.handleSubmit} className={this.state.submitting ? styles.submitting : ''}>
              <textarea 
                name="message" 
                placeholder="Comment" 
                required 
                onChange={this.handleChange}
              />
              <input 
                name="name" 
                type="text" 
                placeholder="Name" 
                required 
                value={this.state.name}
                onChange={this.handleChange}
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                value={this.state.email}
                onChange={this.handleChange}
              />
              <SubmitButton type="submit" disabled={this.state.disabled}>Submit Comment</SubmitButton>
              
            </form>
          )}
        { this.props.comments && 
          this.props.comments.edges.map(({node}) => (
            <Comment key={node.id} name={node.name} date={new Date(node.date*1000)} message={node.message}/>
          ))
        }
      </Centered>
    );
  }
}
