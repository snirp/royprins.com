import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export default class DownloadsChart extends React.Component {
  constructor(props) {
    super(props);

    // Initialize with labels and zero values to enable animation
    const today = new Date();
    today.setHours(24,0,0,0);
    const creationParsed = Date.parse(props.creationDate);
    const day = 86400000;
    const days = Math.floor(( Date.parse(today) - creationParsed ) / day) + 1; 
    this.state = {
      labels: Array.from({length: days}, (v, i) => new Date(creationParsed + i * day).toISOString().slice(0,10)),
      downloads: Array(days).fill(0)
    };
  }
  componentDidMount() {
    const today = new Date().toISOString().slice(0,10);
    const startDay = new Date(Date.parse(this.props.creationDate)).toISOString().slice(0,10);
    axios.get(`https://api.npmjs.org/downloads/range/${startDay}:${today}/${this.props.npmID}`)
      .then(res => {
        this.setState({ downloads: res.data.downloads.map(download => download.downloads) });
      });
  }

  render() {
    return (
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
    );
  }

}