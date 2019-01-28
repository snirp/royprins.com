import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from '@emotion/styled';

import Layout from '../components/Layout';
import MarkdownBody from '../components/MarkdownBody';
import Comments from '../components/Comments';

const Main = styled.main`
  padding-top: 10vh;
  background-color: white;
`;

const Cover = styled.div`
  position: fixed;
  height: 80vh;
  min-height: 400px;
  width: 100%;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Header = styled.header`
  height: 15vh;
  min-height: 100px;
  background-color: white;
  margin-top: 0;
`;

const Spacer = styled.div`
  height: 60vh;
  min-height: 300px;
  background-color: transparent; 
`;

export default ({ data }) => {
  return (
    <Layout>
      <Cover>
        { data.markdownRemark.fields.coverFile && 
          <Img sizes={data.markdownRemark.fields.coverFile.childImageSharp.sizes} style={{
            height: '100%',
            width: '100%',
            zIndex: -2
          }} /> 
        }
      </Cover>
      <Header>
        HOOOI
      </Header>
      <Spacer />
      <Main>
        <MarkdownBody html={data.markdownRemark.html} />
        <a target="_blank" href={'https://github.com/snirp/royprins.com/edit/master'+data.markdownRemark.fileAbsolutePath.split('royprins.com')[1]}>
          edit on github
        </a>
        <Comments slug={data.markdownRemark.fields.slug} comments={data.allCommentsYaml} />
      </Main>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) { 
  
    allCommentsYaml(filter: {slug: {eq: $slug}} sort: {fields:[date] order:DESC}){
      edges{
        node {
          id
          message
          name
          date
        }
      }
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      fileAbsolutePath
      html
      frontmatter {
        title
      }
      fields {
        slug
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
