import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import HeatMap from './HeatMap';

export default class TagMap extends React.Component {
  constructor(props){
    super(props);
  }

  normalizeData = (data) => {
    let result = [];
    for (const {node} of data.posts.edges){
      result.push({
        date: new Date(node.frontmatter.date),
        tags: node.frontmatter.tags.map(tag => tag.toLowerCase())
      });
    }
    for (const {node} of data.projects.edges){
      result.push({
        date: new Date(node.frontmatter.date),
        tags: node.frontmatter.tags.map(tag => tag.toLowerCase())
      });
    }
    for (const {node} of data.libraries.edges){
      result.push({
        date: new Date(node.creationDate),
        tags: node.tags.map(tag => tag.toLowerCase())
      });
    }
    return result;
  }

  transposeData = (data) => {
    const result = [];
    const documents = this.normalizeData(data);
    const startDate = new Date(2018, 2, 10);
    const dateRange = Date.now()-startDate;
    const steps = 12;
    const tagList = [
      {
        name: 'React',
        keywords: ['react', 'reactjs']
      },
      {
        name: 'Django',
        keywords: ['django'],
      },
      {
        name: 'VueJS',
        keywords: ['vue', 'vuejs']
      },
      {
        name: 'Flask',
        keywords: ['flask']
      },
      {
        name: 'Python',
        keywords: ['python', 'py']
      },
      {
        name: 'JavaScript',
        keywords: ['js', 'javascript']
      },
      {
        name: 'GraphQL',
        keywords: ['graphql', 'graphiql']
      },
      {
        name: 'Git',
        keywords: ['git', 'github', 'gitlab', 'github.com']
      },
      {
        name: 'UX/UI',
        keywords: ['ux', 'ui', 'user experience', 'user interface', 'ux/ui']
      },
      {
        name: 'SQL',
        keywords: ['sql', 'mysql', 'sqlite', 'postgres', 'database']
      },
      {
        name: 'productivity',
        keywords: ['productivity', 'gtd']
      },
      {
        name: 'NodeJS',
        keywords: ['node', 'nodejs']
      }
    ];
    

    for (const {name, keywords} of tagList){
      const item = {
        headers: [name,],
        values: new Array(steps).fill(0)
      };

      for (const {date, tags} of documents){
        for(const kw of keywords){
          if(tags.includes(kw)){
            item.values[Math.floor(((date-startDate)/dateRange)*steps)] += 1
            break  // stop at first match
          }
        }
      }
      result.push(item);
    }
    return result;
  };

  render(){
    return(
      <StaticQuery
        query={graphql`
          query {   
            posts: allMarkdownRemark( filter: {fields: {
              source: {eq: "posts"}}, 
              frontmatter: {published: {eq: true}
            }}){
              edges {
                node {
                  frontmatter {
                    tags
                    date
                    title
                  }
                }
              }
            }
            projects: allMarkdownRemark( filter: {fields: {
              source: {eq: "projects"}}
            }){
              edges {
                node {
                  frontmatter {
                    tags
                    date
                  }
                }
              }
            }
            libraries: allLibrariesYaml{
              edges{
                node{
                  tags
                  creationDate
                }
              }
            }
          }
        `}
        render={data => (
          <div>
            <HeatMap 
              data={this.transposeData(data)}
              sizeMode={false}
              headerBasis={['150px',]}
            />
          </div>
        )}
      />
    );
  }

}