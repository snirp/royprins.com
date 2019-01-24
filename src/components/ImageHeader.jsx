import React from 'react';
import Img from 'gatsby-image';

export default data => (
  <div>
    {console.log(data)}
    <Img sizes={data.markdownRemark.post.fields.coverFile.childImageSharp.sizes} />
  </div>
);