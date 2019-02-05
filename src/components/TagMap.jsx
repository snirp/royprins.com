import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import icons from '../resources/icons';

import HeatMap from './HeatMap';
import { RSA_PKCS1_PADDING } from 'constants';

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
    console.log(documents);
    const startDate = new Date(2018, 2, 10);
    const dateRange = Date.now()-startDate;
    const steps = 10;
    const tagList = [
      {
        name: 'React',
        icon: icons.react,
        keywords: ['react', 'reactjs']
      },
      {
        name: 'Django',
        icon: icons.django,
        keywords: ['django'],
      },
      {
        name: 'VueJS',
        icon: icons.vuejs,
        keywords: ['vue', 'vuejs']
      },
      {
        name: 'Flask',
        icon: icons.flask,
        keywords: ['flask']
      },
      {
        name: 'Python',
        icon: icons.python,
        keywords: ['python', 'py', 'flask', 'django']
      },
      {
        name: 'JavaScript',
        icon: icons.javascript,
        keywords: ['js', 'javascript']
      },
      {
        name: 'GraphQL',
        icon: icons.graphql,
        keywords: ['graphql', 'graphiql']
      },
      {
        name: 'Git',
        icon: icons.git,
        keywords: ['git', 'github', 'gitlab', 'github.com']
      },
      {
        name: 'UX/UI',
        icon: '',
        keywords: ['ux', 'ui', 'user experience', 'user interface', 'ux/ui']
      },
      {
        name: 'SQL',
        icon: icons.sql,
        keywords: ['sql', 'mysql', 'sqlite', 'postgres', 'database']
      },
      {
        name: 'productivity',
        icon: '',
        keywords: ['productivity', 'gtd']
      },
      {
        name: 'NodeJS',
        icon: icons.nodejs,
        keywords: ['node', 'nodejs']
      }
    ];
    

    for (const {name, icon, keywords} of tagList){
      const item = {
        headers: [icon, name],
        values: new Array(steps).fill(0)
      };

      for (const {date, tags} of documents){
        for(const kw of keywords){
          if(tags.includes(kw)){
            item.values[steps-Math.floor((date-startDate)/dateRange*steps)] += 1;
            break;  // stop at first match
          }
        }
      }
      result.push(item);
    }
    console.log(result);
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
              data={{
                data:[
                  [null,null,[0.3,20],[0.3,22]],
                  [[0.2,17],[0.8,15],[0.4,20],[0.6,10]],
                  [[0.1,11],[0.7,29],[0.3,27],[0.1,43]],
                ],
                customMin: [null, 0],
                valLength: 2,
              }}
              namespace={'heatmap-'}
              xAxis={{
                labels: ['een', 'twee', 'nummer drie', 'vier']
              }}
              yAxis={{
                labels: ['a', 'beeee', 'c']
              }}
              cell={{
                // content: (val) => String(val[0]),
                onClick: (e,val) => window.alert(val),
                customStyle: {
                  width: '40px',
                  height: '40px',
                }
              }}
              shape={{  
                palette: {
                  dataIndex: 0,
                  palette: [
                    {stop: 0, color: '#CAE8B4'},
                    {stop: 0.5, color: '#208FC6'},
                    {stop: 1, color: '#FFFFDA'},
                  ],
                  gradient: false,
                },
                scaling: 1,
                rounded: true,
              }}
              legend={{
                position: 'top'
              }}
            />
          </div>
        )}
      />
    );
  }

}