import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import HeatMap from './HeatMap';

export default class TagMap extends React.Component {
  constructor(props){
    super(props);
  }

  transposeData = (data) => {
    const steps = 10;
    const tags = ['react', 'python', 'vuejs', 'javascript'];
    const startDate = new Date(2018, 2, 10);
    const totalDiff = Date.now()-startDate;
    const result = [];
    for (const tag of tags){
      const item = {};
      item.headers = [tag, ];
      item.values = new Array(steps).fill(0);
      for(const {node} of data.posts.edges){
        if(node.frontmatter.tags.includes(tag)){
          let tempDate = new Date(node.frontmatter.date);
          const step = Math.floor(((tempDate-startDate)/totalDiff)*steps);
          item.values[step] += 1;
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
                      title
                      tags
                      date
                    }
                  }
                }
              }
          }
        `}
        render={data => (
          <div>
            <HeatMap 
              data={this.transposeData(data)}
              vertical={true}
            />
          </div>
        )}
      />
    );
  }


}