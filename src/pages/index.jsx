import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';

import Layout from '../components/Layout';
import Library from '../components/Library';
import Contact from '../components/Contact';
import TagMap from '../components/TagMap';

export default ({ data }) => (
  <Layout>
    <h1>This is hi</h1>
    <p>Welcome to my website</p>
    <a href="">Contact me</a>

    <section id="about">
      <h2>About me</h2>
      <p>Lorem ipsum and such</p>
    </section>

    <TagMap data={data}/>

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
      {data.libraries.edges.map(({ node }) => (
        <Library key={node.id} {...node} />
      ))}
    </section>
    
    <section id="blog">
      <h2>Blog posts</h2>
      <ul>
        {data.posts.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>{node.frontmatter.title}  — {node.frontmatter.date}</Link>
            <Img sizes={node.fields.coverFile.childImageSharp.sizes} />
          </li>
        ))}
      </ul>
      <a href="#">MORE</a>
    </section>
    {/* <ContactForm/> */}
    <Contact/>
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
            coverFile {
              childImageSharp {
                sizes(maxWidth: 600) {
                  ...GatsbyImageSharpSizes_tracedSVG
                }
              }
            }
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