import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

import Img from 'gatsby-image';

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <div>
        {post.fields.heroFile && <Img sizes={post.fields.heroFile.childImageSharp.sizes} />}
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
        heroFile {
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
