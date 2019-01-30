import React from 'react';
import axios from 'axios';

export default class Comment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      submitted: false
    };
  }

  formName = 'contact';

  handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    formData.append('form-name', this.formName);
    const params = Array.from(formData.entries()).map(entry => 
      encodeURIComponent(entry[0]) + "=" + encodeURIComponent(entry[1])
    ).join('&');
    axios.post('/', params)
    .then(res => {
      this.setState({submitted: true})
      // Other stuff here: success message
    })
    .catch((error) => {
      console.log(error);
      // Error handling here
    });
  }

  render() {
    return (
      <form name={this.formName} onSubmit={this.handleSubmit} data-netlify="true" action="/">
        <label>name<input type="text" name="name" /></label>   
        <label>email<input type="email" name="email" /></label>
        <label>message<textarea name="message"></textarea></label>
        <button type="submit">Send</button>
      </form>
)}};