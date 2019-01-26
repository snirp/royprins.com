import React from 'react';
import axios from 'axios';

import Comment from '../Comment';
import './style.css';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      submitting: false,
      submitted: false,
      name: '',
      email: '',
      message: '',
      submittedComment: {
        name: '',
        message: '',
      }
    };
  }

  seemsValid = () => {
    switch(true){
      case this.state.name.length < 2:
        return false
      case !/\S+@\S+\.\S+/.test(this.state.email):
        return false
      case this.state.message.length < 2:
        return false
      default:
        return true
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value}, () => {
      this.setState({ disabled: !this.seemsValid() });
    });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({submitting: true})
    axios.post('https://dev.staticman.net/v3/entry/github/snirp/royprins.com/master/comments', {
      fields: {
        slug: this.props.slug,
        name: this.state.name,
        email: this.state.email,
        message: this.state.message,
      }
    })
    .then(res => {
      this.setState({submitting: false})
      this.setState({submitted: true})
    })
    .catch((error) => {
      console.log(error);
      this.setState({submitting: false})
    });
  }

  render() {
    return(
      <div>
        { this.state.submitted 
          ?( <Comment name={this.state.name} date={new Date()} message={this.state.message}/> )
          :(
            <form onSubmit={this.handleSubmit} className={this.state.submitting ? "submitting" : ""}>
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
              <textarea 
                name="message" 
                placeholder="Comment" 
                required 
                onChange={this.handleChange}
              />
              <button type="submit" disabled={this.state.disabled}>Submit Comment</button>
            </form>
          )}
        {this.props.comments.map(({node}) => (
          <Comment key={node.id} name={node.name} date={new Date(node.date*1000)} message={node.message}/>
        ))}
      </div>
    );
  }
}
