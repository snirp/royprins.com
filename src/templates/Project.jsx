import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

export default ({ data }) => {
  const project = data.markdownRemark;
  return (
    <Layout>
      <div>
        <h1>{project.frontmatter.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        name
      }
    }
  }
`;
