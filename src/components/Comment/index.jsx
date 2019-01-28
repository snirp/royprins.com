import React from 'react';

function timeDeltaString(date){
  const diff = new Date() - date;
  const minute = 1000*60;
  const hour = minute*60;
  const day = hour*24;
  switch(true){
  case diff > 7*day:
    return '2011-06-16';
  case diff > 2*day:
    return `${Math.floor(diff/day)} days ago`;
  case diff > 1*day:
    return '1 day ago';
  case diff > 2*hour:
    return `${Math.floor(diff/hour)} hours ago`;
  case diff > 1*hour:
    return '1 hour ago';
  case diff > 2*minute:
    return `${Math.floor(diff/minute)} minutes ago`;
  default:
    return 'just now';
  }
}

export default ({name, date, message}) => (
  <div>
    <div><strong>{name}</strong> <small>{timeDeltaString(date)}</small></div>
    <div>{message}</div>
  </div>
);