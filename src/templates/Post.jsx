import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';

import ImageHeader from '../components/ImageHeader';


export default ({ data }) => {
  return (
    <div>
      {/* This works */}
      <Img sizes={data.markdownRemark.fields.coverFile.childImageSharp.sizes} />

      {/* This doesn't work */}
      <ImageHeader data={data} />
      
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </div>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      fields {
        coverFile {
          childImageSharp {
            sizes(maxWidth: 1400) {
              ...GatsbyImageSharpSizes_tracedSVG
            }
          }
        }
      }
    }
  }
`;
