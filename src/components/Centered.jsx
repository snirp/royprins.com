import React from 'react';

export default ({children, bg}) => (
  <div style={{
    backgroundColor: bg,
    padding: '20px'
  }}>
    <div style={{
      maxWidth: '860px',
      margin: '0 auto'
    }}>
      {children}
    </div>
    
  </div>
);