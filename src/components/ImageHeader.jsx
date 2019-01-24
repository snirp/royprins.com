import React from 'react';
import Img from 'gatsby-image';
import styled from '@emotion/styled';

const HeaderWrapper = styled.header`
  background-color: lightblue;
  min-height: 60px;
  margin-bottom: 2rem;
`;

// const Cover = styled(Img)`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
// `;

const HeaderContainer = styled.header`
  color: white;
  padding: 1rem;
  margin: 0 auto;
  max-width: 960px;
`;

export default ({data}) => (
  <HeaderWrapper>
    {console.log(data)}
    <HeaderContainer>
      <h1>This is the title</h1>
    </HeaderContainer>
    <Img sizes={data.markdownRemark.post.fields.coverFile.childImageSharp.sizes} />
  </HeaderWrapper>
);

