import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

import Img from 'gatsby-image';

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <div>
        {post.fields.coverFile && <Img sizes={post.fields.coverFile.childImageSharp.sizes} />}
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
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
            sizes(maxWidth: 700) {
              ...GatsbyImageSharpSizes_tracedSVG
            }
          }
        }
      }
    }
  }
`;
