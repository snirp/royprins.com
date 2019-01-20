import React from 'react';
import axios from 'axios';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {downloads: []};
  }

  componentDidMount() {
    axios.get(`https://api.npmjs.org/downloads/range/last-month/${this.props.npmID}`)
      .then(res => {
        this.setState({ downloads: res.data.downloads });
      });
  }

  render() {
    return (
      <ul>
        {this.state.downloads.map(download =>
          <li key={download.day}>{download.downloads}</li>
        )}
      </ul>
    );
  }
}
