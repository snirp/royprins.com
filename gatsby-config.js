module.exports = {
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/data/libraries`,
        name: 'libraries'
      }
    }, 
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/data/comments`,
        name: 'comments'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/data/posts`,
        name: 'posts'
      }
    }, 
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/data/projects`,
        name: 'projects'
      }
    },
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-unwrap-images',
          'gatsby-remark-code-titles',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
  ]
};
