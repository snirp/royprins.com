import React from 'react';
import Layout from '../components/layout';
import { Link, graphql } from 'gatsby';

export default ({ data }) => (
  <Layout>
    <h1>This is hi</h1>
    <p>Welcome to my website</p>
    <button>Contact me</button>

    <segment id="about">
      <h2>About me</h2>
      <p>Lorem ipsum and such</p>
      
    </segment>

    <segment id="projects">
      <h2>Projects</h2>
      <ul>
        {data.projects.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>{node.frontmatter.name}</Link>
          </li>
        ))}
      </ul>
      <a href="#">MORE</a>
    </segment>

    <segment id="libaries">
      <h2>Libraries</h2>
      <p>Open source stuff for the general good.</p>
      <ul>
        <li>Lib 1</li>
        <li>Lib 2</li>
        <li>Lib 3</li>
      </ul>
    </segment>

    <segment id="blog">
      <h2>Blog posts</h2>
      <ul>
        {data.posts.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>{node.frontmatter.title}  — {node.frontmatter.date}</Link>
          </li>
        ))}
      </ul>
      <a href="#">MORE</a>
    </segment>

  </Layout>
);

export const query = graphql`
  query {
    posts: allMarkdownRemark(
      filter: {fields: {source: {eq: "posts"}}, frontmatter: {published: {eq: true}}}
      sort: { order: DESC, fields: frontmatter___published }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
    projects: allMarkdownRemark(
      filter: {fields: {source: {eq: "projects"}} }
      sort: { order: ASC, fields: frontmatter___sort }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            name
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;