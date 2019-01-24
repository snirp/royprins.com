---
title: Tutorial for a basic Gatsby blog
date: 2018-04-21
published: true
tags:
  - gatsby
  - nodejs
---
In this tutorial we will set up a fairly minimal blog. The goal is to learn about Gatsby's data architecture, which revolves around `nodes`. The following will be covered:
+ Basic setup;
+ How Gatsby goes from data to page;
+ Read the file data through source plugins;
+ Transform the file nodes;
+ The GraphQL schema;
+ Listing the blog posts;
+ Paths for our blog posts;
+ Generating individual blog posts;
+ Add links to the blog index;
+ Wrap it up;

# Basic setup

In a previous post I have detailled how to set up Gatsby with Netlify CMS, to provide an admin interface to your website. I would highly recommend reading that first (and skip the rest of this section). If you did not, here are some brief instructions to get started from scratch (but without a CMS).

```bash
npm install -g gatsby
gatsby new <myblog> https://github.com/gatsbyjs/gatsby-starter-hello-world && cd _
mkdir src/data/blogs
```

In this new directory, create several markdown files like `my-first-blogpost.md` that look similar to:

`src/data/blogs/my-first-blogpost.md`
```yaml
---
title: This is my first blogpost
subtitle: And this is the subtitle
date: "2018-04-20"
published: true
---
Actual `markdown` section starts here. Lorem ipsum dolor sit amet,
consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, etc
```
This is actually not pure Markdown: the first section (between `---`) contains so called "frontmatter" in YAML. The frontmatter will be parsed separately by the markdown transformer and can provide "metadata" about the post. You are free to add some fields and use that for fillering or sorting.

# How Gatsby goes from data to page

Typically - and in our case - Gatsby has the following workflow:

1. Use "source plugins" to create nodes from various sources, such as files or external APIs. Example: the `gatsby-source-filesystem` plugin transforms a file into a `File node`;
2. Use "transformer plugins" to create new types of nodes from the source nodes and make these available as "children". Example: the `gatsby-transformer-remark` transforms a `File node` into a `MarkdownRemark node` with an HTML representation of the markdown.
3. Gatsby automatically infers the structure of your site’s nodes and creates a GraphQL schema.
4. Query the Gatsby graph from your site’s components through GraphQL.
5. Use the data to generate pages and provide content.

# Read the file data through source plugins

Install the filesystem source plugin and configure this in `gatsby-config.js` in the root of your project.

```bash
npm install --save gatsby-source-filesystem
```

```javascript
// gatsby-config.js
module.exports = {

  plugins: [
    // You can have multiple instances of this plugin to read
    // source nodes from different locations on your filesystem.
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/src/data/blogs`,
      },
    },
  ],
};
```

We point the filesystem plugin to our blog directory and the `name` ("blogs") will be available as a `sourceInstanceName` on the File node. Let's jump ahead a few steps and see how we can query the file nodes through GraphQL. First we (re)start the development server.

```bash
gatsby develop
```

And we can make use of a built-in tool that allows us to execute queries in the browser: Graph*i*QL. Open up [http://localhost:8000/___graphql](http://localhost:8000/___graphql) in your browser and make sure you have the `Docs` pane open as well. GraphQL is a recent protocol from Facebook, that partially overlaps REST. [This](https://reactjs.org/blog/2015/05/01/graphql-introduction.html) is a good introduction and the [docs are here](http://graphql.org/learn/). In graph*i*QL write your first query:


```graphql
query FileQuery {
  allFile {
    edges {
      node {
        extension
        dir
        modifiedTime
      }
    }
  }
}
```

This should give you a list of the files in the `src/data/blogs` folder with some of their properties. Something like this:

```
{
  "data": {
    "allFile": {
      "edges": [
        {
          "node": {
            "sourceInstanceName": "blogs",
            "relativePath": "2018-04-19_my-first-blog.md",
            "extension": "md",
            "dir": "/full/path/src/data/blogs"
          }
        },
        {
          "node": {
            "sourceInstanceName": "blogs",
            "relativePath": "2018-04-19_second-blog.md",
            "extension": "md",
            "dir": "/full/path/src/data/blogs"
          }
        },
        {
          "node": {
            "sourceInstanceName": "blogs",
            "relativePath": "2018-04-20_last-blog.md",
            "extension": "md",
            "dir": "/full/path/src/data/blogs"
          }
        }
      ]
    }
  }
}
```

Note that:

* The response is given inside a `data` object.
* The shape and field names of the response mirror the shape and field names of the request.

Play around a bit to explore other fields. We can get lots of information on the files, but not much that is directly going to  help building our blog.

# Transform the file nodes

We created the blog files as markdown with YAML frontmatter. There is a plugin that can consume the `File` nodes and turn them into `MarkdownRemark` nodes. These will have the frontmatter available, provide a HTML rendering of our markdown, and a plain text excerpt.

```
npm install gatsby-transformer-remark --save
```

As with any plugin, we update `gatsby-config.js` to use it. It should now look like this:

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-remark`,  // ADD THIS LINE
  ],
};
```

Restart the development server and again visit [localhost:8000/___graphql](http://localhost:8000/___graphql). We now have the option to see do an `allMarkdownRemark` query, which will only return `MarkdownRemark` nodes. This should demonstrate that we can get a lot of useful information back from these nodes:

```graphql
query PublishedBlogs {
  allMarkdownRemark(
    filter: { frontmatter:  { published: { eq:true }}}, 
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    totalCount
    edges {
      node {
        id
        timeToRead
        wordCount {
          words
        }
        excerpt(pruneLength:200)
        frontmatter {
          title
          subtitle
          date
        }
      }
    }
  }
}
```

A lot going on here. These are some highlights:
+ We filter the nodes on a value in the frontmatter `published: { eq: true }`, so that we have control over which blog posts actually show up.
+ We sort by `date`, so that the most recent blog posts show up first.
+ We are given some helpful fields by the `transformer` plugin, such as: `timeToRead`, `wordCount` and a plain text `excerpt` and the `totalCount` of nodes.
+ The frontmatter fields are all accessible.

The result should look something like this:

```javascript
{
  "data": {
    "allMarkdownRemark": {
      "totalCount": 5,
      "edges": [
        {
          "node": {
            "id": "/full/path/src/data/blogs/2018-04-20_my-blog-post.md absPath of file >>> MarkdownRemark",
            "timeToRead": 8,
            "wordCount": {
              "words": 1409
            },
            "excerpt": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur…",
            "frontmatter": {
              "title": "This is a blog post.",
              "subtitle": "Because explaining stuff makes sense.",
              "date": "2018-04-20"
            }
          }
        },
        // more nodes...
      ]
    }
  }
}
```
If we think about a typical overview page for a blog, this should provide about all the information we need. Play around with the query until it suits your specific needs.

# The GraphQL schema

In the previous steps we went ahead and built graphQL queries. This is possible because Gatsby interprets the nodes and builds a graphQL schema. Having the schema available means that graph*i*QL can have documentation, autocomplete and suggestions, and we can actually directly introspect the schema:

```graphql
query SchemaTypes {
  __schema {
        types {
      name
    }
  }
}
```

# Listing the blog postings

This is the part where we will finally build a webpage. There are [three ways to create a page](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/) in Gatsby:
1. Place a file in the `src/pages` folder and make sure it exports a `React` component (or a string). Gatsby will automatically compose pages and the path will match the filename.
2. In your site’s `gatsby-node.js` by implementing the API `createPages`.
3. Plugins can also implement `createPages` and create pages for you.

In the background Gatsby uses React router and registers the pages you create in React router. We use the first method in this section to list the blog postings and the second method to dynamically create individual blog pages a bit later.

Edit the `src/pages/index.js` to resemble:

```javascript
import React from "react";

export default ({ data }) => {
  console.log(data);
  return (
    <div>
      <h1>My blog index</h1>
      <hr/>
      {data.allMarkdownRemark.edges.map(({ node }, index) =>
        <div key={index}>
          <h2>{node.frontmatter.title} - {node.frontmatter.date}</h2>
          <h3>{node.frontmatter.subtitle}</h3>
          <div>{node.excerpt}</div>
          <hr/>
        </div>
      )}
    </div>
  );
}

export const pageQuery = graphql`
query PublishedBlogs {
  allMarkdownRemark(filter: { frontmatter:  { published: { eq:true}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    edges {
      node {
        id
        timeToRead
        wordCount {
          words
        }
        excerpt(pruneLength:200)
        frontmatter {
          title
          subtitle
          date
        }
      }
    }
  }
}
`;
```

Open [localhost:8000/](http://localhost:8000/) to see the results. We are not winning any webdesign awards, but the data should be there. Some things to note about the code:

+ At the end of the file, we provide the same graphQL query that we formulated earlier. Remember that a query returns a `data` object, in which the layout of the results mirrors the query. 
+ The `data` object is consumed in the React component through dependency injection.
+ We map the array of edges to React nodes.
+ No link has yet been created to the individual blog posts.

# Paths for our blog posts

We need to decide on a path to individual blog posts, and make it available to components. The slug pattern `/blog/2018-04-20_my-blogpost/` seems nice, where the second portion is based on the filename. Some tutorials will suggest having a `path` field in the frontmatter to manually set the path. I consider that to be an anti-pattern. We know the filenames to be unique and remain constant. It also takes away the responsibility of creating a pathname away from the author, who may not be technical.

How do we make data (such as the path slug) available to components? That's right: like any data we need in our components, we get it by querying the nodes. So let's make sure the node actually contains a slug field that we can use.

The source and transformer plugins are not concerned with providing routing for our webapp, so we will have to add the slug field manually. Turns out that Gatsby provides a node API that lets us interact with the nodes. Create the file `gatsby-node.js` in the root:

```javascript
// gatsby-node.js

const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === `MarkdownRemark`) {
    const source = getNode(node.parent).sourceInstanceName;
    if (source === `blogs`) {
      const relativeFilePath = createFilePath({node, getNode, basePath: ``});
      createNodeField({ 
        node, 
        name: `slug`, 
        value: `/blog${relativeFilePath}` 
      });
      createNodeField({ 
        node, 
        name: `source`, 
        value: source 
      })
    }
  }
};

```

Some things to note:
+ We interact with the `onCreateNode` api, which is called whenever a new node is created. That would go for our `MarkdownRemark` nodes, but also the underlying `File` nodes.
+ We filter to see only `MarkdownRemark` nodes. These are always children of a `File` node. Remember that the parent `File` node was given a `sourceInstanceName` in the `node-config.js` file. We use that to filter only our blogs. Many tutorials - including the offical one - default to filtering blog posts based on the file path here. I feel it is better to only have the path defined in the `gatby-config.js` file (do not repeat yourself).
+ `createFilePath` is a helper function that returns a cleaned up file path for a node.
+ We use the `createNodeField` api to create a node field with the name `slug`, which contains our desired path slug. 
+ We also add a `source` field, which will make it easy to discern our blog nodes from other other markdownRemark nodes in the future.
+ Our newly created fields are available through GraphQL:

```graphql
query pathSlug {
  allMarkdownRemark {
    edges {
      node {
        fields {
          slug
          source
        }
      }
    }
  }
}
```

# Generating individual blog pages

To generate the individual blog pages, we will employ the second method to generate pages with Gatsby: use the `createPage` api. Add the following code to the `gatsby-node.js` file we created in the previous section.

```javascript
// gatsby-node.js

...

const path = require(`path`);

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    graphql(`
      query PublishedBlogs {
        allMarkdownRemark(filter: {fields: {source: {eq: "blogs"}}, frontmatter: {published: {eq: true}}}) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {

      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        // Create blog posts
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: { slug: node.fields.slug, },
        });

      resolve()
    })
  })
};

```
There's a lot going here:
+ We execute the `graphql` query inside a Promise.
+ The query filters all `MarkdownRemark` nodes on the "source", so that we only get the blog pages. This is of no consequence now, but will prove very helpful once we start adding other data sources.
+ The `result` will have the `data` object, which only has the `slug` field. This is all we need to build the route and pass the proper context to the template.
+ The `createPage` function takes an object with three properties:
  + `path` - this will be used in the routing and equals the slug field, which we earlier defined as `/blog/<date>_<file-slug>`;
  + `component` - the path will be resolved to the react component we provide here;
  + `context` - this passes an object to the React component. In this case, we will pass the `slug` to uniquely identify the node or "blog post" we want to display in the react component.

Next we need to make work of displaying the actual blog pages. We instructed to use a component at `/src/templates/blog-post.js` for the blog post. Let's create that with the following code:
 
```javascript
import React from "react";
import Link from "gatsby-link";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <Link to="/">
        Go to blog index
      </Link>
      <h1>{post.frontmatter.title}</h1>
      <h2>{post.frontmatter.subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: post.html }}/>
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        subtitle
      }
    }
  }
`;
```
Some new stuff is happening here:
+ Starting from the bottom, the graphql query takes a variable named `$slug`. This is made available through the `context` provided by the `createPage` method;
+ This variable is used to select the right markdownRemark instance;
+ The result of the query is made available as `data`. The `html` field contains an html rendering of the markdown text. The `markdownRemark` plugin has taken care of providing that.

Restart your development server to see the changes. Open [http://localhost:8000/dsdsd](http://localhost:8000/dsdsd) or any random address to see a default 404 page. This page shows all routes that have been registered with the Gatsby router and your blog pages should show up.

# Add links to the blog index

We want our users to be able to click through the blog. We made the `/src/pages/blog.js/` earlier to hold our index, but omitted adding the actual links. 

Edit the graphql query under `node` to include:

```javascript
fields {
  slug
}
```

And surround the individual blogposts with a Link component.

```javascript
import Link from "gatsby-link";
...

<Link to={node.fields.slug}>
   ...
</Link>
```
You should have a blog ready now!

# Wrap it up

We used only the built-in development server. This works great for development (mainly due to Hot Module Replacement), but in the end we want a static page. Look at the [docs for deployment](https://www.gatsbyjs.org/docs/deploy-gatsby/) or my other blogpost about deploying to Netlify.

We now have a basic blog (and CRM if you followed the earlier tutorial). It still leaves a lot to be desired:
+ **Tags** would be a nice way to explore the content;
+ We did do no **webdesign** and we definitely need that;
+ No custom **header tags**, no search engine optimization;
+ Provide a way to contact and **comment**;
+ And more stuff...
 
We will explore this step-by-step in future tutorials.

# My thoughts

+ Sorting in graphQL doesn't look very flexible on first glance. Possible to combine ascending and descending sorting options? 
+ Important to note that you can have only one query (or data object) per component. GraphQL can gather separate entities in a single query, so this should never be a problem.
