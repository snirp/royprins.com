import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from '@emotion/styled';

import Layout from '../components/Layout';
import MarkdownBody from '../components/MarkdownBody';

const GradientHeader = styled.header`
  position: relative;
  height: 80vh;
  min-height: 300px;
  margin-bottom: 6rem;
  overflow: hidden;
    &::after {
      z-index: -1;
      display: block;
      position: relative;
      background-image: linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.7) 100%);
      margin-top: -80vh;
      height: 80vh;
      width: 100%;
      content: '';
    }
`;

const HeaderContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

const Title = styled.h1`
  padding: 0 30px 20px;
  max-width: 860px;
  font-weight: 100;
  text-align: center;
  font-size: 28px;
`;

export default ({ data }) => {
  return (
    <Layout>
      <GradientHeader>
        <HeaderContent>
          <Title>{data.markdownRemark.frontmatter.title}</Title>
        </HeaderContent>
        { data.markdownRemark.fields.coverFile && 
          <Img 
            sizes={data.markdownRemark.fields.coverFile.childImageSharp.sizes} 
            style={{position: 'absolute', height: '100%', width: '100%', zIndex: -2, top: 0, left: 0}} 
          /> 
        }
      </GradientHeader>
      <MarkdownBody html={data.markdownRemark.html} />
      <a target="_blank" href={'https://github.com/snirp/royprins.com/edit/master'+data.markdownRemark.fileAbsolutePath.split('royprins.com')[1]}>
        edit on github
      </a>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      fileAbsolutePath
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
