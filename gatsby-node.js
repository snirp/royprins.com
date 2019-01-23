const path = require('path');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
    const source = fileNode.sourceInstanceName;
    if (source === 'posts') {
      // Provide string for regex constructor
      createNodeField({
        node,
        name: 'coverFile',
        value: './cover.jpg'
      });
      createNodeField({
        node,
        name: 'slug',
        value: `/blog/${path.parse(fileNode.absolutePath).dir.split('---').pop()}/`
      });
      // Make filesystem source available to MarkdownRemark nodes
      createNodeField({
        node,
        name: 'source',
        value: source
      });
    } else if (source === 'projects') {
      createNodeField({
        node,
        name: 'coverFile',
        value: './cover.jpg'
      });
      createNodeField({
        node,
        name: 'slug',
        value: `/project/${path.parse(fileNode.absolutePath).dir.split('/').pop()}/`
      });
      createNodeField({
        node,
        name: 'source',
        value: source
      });
    }
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve('src/templates/Post.jsx');
  const projectTemplate = path.resolve('src/templates/Project.jsx');

  // Blog posts and projects
  return graphql(`
		{
			posts: allMarkdownRemark(
				filter: {fields: {source: {eq: "posts"}}, frontmatter: {published: {eq: true}}}
				sort: { order: DESC, fields: frontmatter___published }
			) {
				edges {
					node {
						fields {
							slug
						}
					}
				}
      }
			projects: allMarkdownRemark(
				filter: {fields: {source: {eq: "projects"}} }
				sort: { order: ASC, fields: frontmatter___sort }
			) {
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
    if (result.errors) {
      Promise.reject(result.errors);
    }
    result.data.posts.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: postTemplate,
        context: {
          slug: node.fields.slug,
        },
      });
    });
    result.data.projects.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: projectTemplate,
        context: {
          slug: node.fields.slug,
        },
      });
    });
  });
};
