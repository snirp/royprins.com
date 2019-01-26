import React from 'react';
import './style.css';
import './code-tag.css';
import './prism-ghcolors.css';

export default ({html}) => <article className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
