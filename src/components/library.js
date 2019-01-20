import React from 'react';
import axios from 'axios';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {downloads: []};
  }

  componentDidMount() {
    const today = new Date().toISOString().slice(0,10);
    axios.get(`https://api.npmjs.org/downloads/range/${this.props.creationDate}:${today}/${this.props.npmID}`)
      .then(res => {
        this.setState({ downloads: res.data.downloads });
      });
  }

  render() {
    return (
      <li>
        {this.props.name} - {this.props.creationDate}
        <ul>
          {this.state.downloads.map(download =>
            <li key={download.day}>{download.downloads}</li>
          )}
        </ul>
      </li>
    );
  }
}
