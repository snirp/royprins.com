import React from 'react';
import axios from 'axios';

const encode = data =>
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

export default class Comment extends React.Component {
  state = {
    submitted: false
  };

  handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    formData.append('form-name', 'contact');
    const params = Array.from(formData.entries()).map(e => 
      encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1])
    ).join('&');
    axios.post('/', params)
    .then(res => {
      console.log(params)
      this.setState({submitted: true})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
  <form name="contact" onSubmit={this.handleSubmit} data-netlify="true" action="/">
    <p>
      <label>NAME<input type="text" name="name" /></label>   
    </p>
    <p>
      <label>EMAIL <input type="email" name="email" /></label>
    </p>
    <p>
      <label>MESSAGE <textarea name="message"></textarea></label>
    </p>
    <p>
      <button type="submit">Send</button>
    </p>
  </form>
)}};