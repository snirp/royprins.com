import React from 'react';
import Layout from '../components/layout';
import Library from '../components/library';
import { Link, graphql } from 'gatsby';

export default ({ data }) => (
  <Layout>
    <h1>This is hi</h1>
    <p>Welcome to my website</p>
    <button>Contact me</button>

    <section id="about">
      <h2>About me</h2>
      <p>Lorem ipsum and such</p>
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <ul>
        {data.projects.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>{node.frontmatter.name}</Link>
          </li>
        ))}
      </ul>
      <a href="#">MORE</a>
    </section>

    <section id="libaries">
      <h2>Libraries</h2>
      <p>Open source stuff for the general good.</p>
      <ul>
        {data.libraries.edges.map(({ node }) => (
          <Library key={node.id} {...node} />
        ))}
      </ul>
    </section>

    <section id="blog">
      <h2>Blog posts</h2>
      <ul>
        {data.posts.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>{node.frontmatter.title}  — {node.frontmatter.date}</Link>
          </li>
        ))}
      </ul>
      <a href="#">MORE</a>
    </section>

  </Layout>
);

export const query = graphql`
  query {
    libraries: allLibrariesYaml{
      edges{
        node{
          id
          name
          npmID
          creationDate
          description
          language
          repository
          samples
          documentation
        }
      }
    }
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