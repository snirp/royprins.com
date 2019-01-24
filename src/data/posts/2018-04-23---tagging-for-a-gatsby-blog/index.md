---
title: Tagging for a gatsby blog
date: 2018-04-23
published: true
tags:
  - gatsby
  - javascript
  - graphql
---
Tags provide a flexible and scalable way to keep your (blog) contents organized. We will explore how we can use Netlify + Gatsby to set it up for the blog we created earlier. Here are the important steps:

+ Add the tags to your markdown posts;
+ Create an overview page for your tags;
+ Define the routes (DRY);
+ Create pages from the node api;
+ The individual tag component;
+ Wrap it up;

# Add the tags to your markdown posts

Like any data that we want to extract from the markdown files, we will add the tags in the frontmatter. To configure Netlify to use the tags: update `/static/admin/config.yml` to include the `tags` field:

```yaml
collections:
  - name: blog
    ...
    fields:
      ...
      - { name: tags, label: Tags, widget: list }
```
Choosing the `list` widget allows us to enter multiple tags separated by a comma. Update your markdown files to privde the tags through the Netlify CMS or manually.

```yaml
---
...
tags:
  - webdevelopment
  - netlify
  - gatsby
---
```

# Create an overview page for your tags

Like with the blog postings, we will start by creating an overview page. We call it `src/pages/tag.js` and Gatby will make it available at: [http://localhost:8000/tag/](http://localhost:8000/tag/)

```javascript
import React from "react";

export default ({data}) => (
  <div>
    <h1>Tags</h1>
    <ul>
      {data.allMarkdownRemark.group.map(tag => (
        <li key={tag.fieldValue}>
          {tag.fieldValue} ({tag.totalCount})
        </li>
      ))}
    </ul>
  </div>
);

export const tagsQuery = graphql`
query TagsQuery {
  allMarkdownRemark(
    limit: 2000
    filter: { frontmatter: { published: { eq: true } } }
  ) {
    group(field: frontmatter___tags) {
      fieldValue
      totalCount
    }
  }
}`;
```

Note that GraphQL supports aggregation of fields through `group`. The aggregated value is available as `fieldValue` and the count as `totalCount`. The rest of this code sample should have no surprises.

As a further sophistication, it would not be hard to present the actual blog posts under each tag. Graphql can be pretty powerful. Here is a hint:

```graphql
query TagsQuery {
  allMarkdownRemark(limit: 2000, filter: {frontmatter: {published: {eq: true}}}) {
    group(field: frontmatter___tags) {
      fieldValue
      totalCount
      edges {
        node {
          frontmatter {
            title
          }
          fields { slug }
        }
      }
    }
  }
}
```

# Define the routes (DRY)

While not essential, I feel like it is a good idea to keep routes organized in one place. Gatsby does not provide for this, so we will roll our own solution. We will install a library:

```bash
npm install lodash --save
```

And create the file `src/utilities/routing.js`:

```javascript
const {kebabCase} = require("lodash");

exports.makeRoute = {
  tagList: () => `/tag/`,
  tagPage: ({tag}) => `/tag/${kebabCase(tag)}/`,
};
```

Components and configuration files can now consistently use  `makeRoute.tagPage({tag})` to generate routes and links. If we decide on a different link (`tags` instead of `tag`), we only have to update it here.

# Create pages from the node api

We configured the `createPages` function in `gatsby-node.js` earlier for the blog posts. Only a few changes are needed to add the individual tag pages. Here is what the updated `createPages` section looks like.

```javascript
//gatsby-node.js

...

const { makeRoute } = require(`./src/utilities/routing.js`);

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    graphql(`
      query allPublishedBlogs {
        allMarkdownRemark(filter: {fields: {source: {eq: "blogs"}}, frontmatter: {published: {eq: true}}}) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `).then(result => {
      let tags = [];

      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        // Create blog posts
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: { slug: node.fields.slug, },
        });
        // Collect tags
        tags = tags.concat(node.frontmatter.tags);
      });

      // Eliminate duplicate tags and make pages
      tags = [ ...new Set(tags) ];
      tags.forEach( tag => {
        createPage({
          path: makeRoute.tagPage({tag}),
          component: path.resolve("./src/templates/tag.js"),
          context: { tag, },
        });
      });

      resolve()
    })
  })
};
```

Here is a quick rundown what this accomplishes in respect to the tags:
+ The tags are added to the graphql query;
+ While iterating the nodes, the tags are accumulated in the `tags` array;
+ We remove the duplicates and create a page per tag:
  + the path is generated using our own routing solution;
  + the `tag` itself is passed in the context for use by the component.

# The individual tag component

As defined above, the component responsible for handling the individual tag pages is `/src/templates/tag.js`. We want that to display the tag (that we passed in the context) and all posts with this specific tag. Here is one way to do that:

```javascript
import React from "react";
import Link from "gatsby-link";

import {makeRoute} from "../utilities/routing"

export default ({ pathContext, data }) => {
  const { tag } = pathContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  return (
    <div>
      <h1>{tag} ({totalCount})</h1>
      <ul>
        {edges.map(({ node }, index) => {
          return (
            <li key={index}>
              <Link to={node.fields.slug}>
                {node.frontmatter.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to={makeRoute.tagList()}>All tags</Link>
    </div>
  );
};

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, published: { eq: true } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
```

This should be largely familiar:
+ The graphql query takes the `tag` from the context as its argument.
+ Only nodes where the tags list contains the `tag` will be returned.
+ The context is also made available in the properties of the component.

# Wrap it up

Taken together this should give you a custom tagging solution, complete with the necessary pages. The tags should also work across different data sources.
