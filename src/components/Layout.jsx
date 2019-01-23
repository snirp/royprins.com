import React from 'React';
import { css } from '@emotion/core';

const cssContainer = css`
  margin: 0 auto;
  max-width: 700px;
  padding: 10px;
  padding-top: 20px;
`;

export default ({ children }) => (
  <div css={cssContainer}>
    <p>menu</p>
    { children }
  </div>
);