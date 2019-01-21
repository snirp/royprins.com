import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      downloads: []
    };
  }

  componentDidMount() {
    const today = new Date().toISOString().slice(0,10);
    { this.props.npmID &&
    axios.get(`https://api.npmjs.org/downloads/range/${this.props.creationDate}:${today}/${this.props.npmID}`)
      .then(res => {
        this.setState({ labels: res.data.downloads.map(download => download.day) });
        this.setState({ downloads: res.data.downloads.map(download => download.downloads) });
      });
    }
  }

  render() {
    return (
      <div>
        {this.props.name} - {this.props.creationDate}
        { this.props.npmID &&
        <Line
          options={{
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                display: false
              }],
              xAxes: [{
                display: false
              }]
            }
          }}
          data={{
            labels: this.state.labels,
            datasets: [
              {
                label: 'downloads',
                data: this.state.downloads.reduce((a, x, i) => [...a, x + (a[i-1] || 0)], []),
              }
            ]
          }}
        />
        }
      </div>
    );
  }
}
