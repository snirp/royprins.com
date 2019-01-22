import React from 'react';
import DownloadChart from './downloads-chart';

export default class Library extends React.Component {
  render() {
    return (
      <div>
        {this.props.name} - {this.props.creationDate}
        { this.props.npmID &&
          <DownloadChart npmID={this.props.npmID} creationDate={this.props.creationDate}/>
        }
      </div>
    );
  }
}
