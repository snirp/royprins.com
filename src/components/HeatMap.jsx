import React from 'react';
import styled from '@emotion/styled';

export default ({
  labelsX=['aap', 'noot', 'mies', 'boom'],
  labelsY=['ma', 'dinsdag', 'wo'],
  data=[
    [0,1,0,3],
    [4,5,1,0],
    [2,2,2,2],
  ],
  opacityMode=true,
  sizeMode=true,
  classPrefix='',
  dangerousLabels=false,
}) => {
  const flatArray = data.reduce((acc, cv) => [...acc, ...cv], []);
  const min = Math.min(...flatArray);
  const max = Math.max(...flatArray);

  return(
    <div style={{
      display: 'grid',
      gridTemplateColumns: 50px

    }}>
      <div></div>
    </div>
  );
};


const Primary = styled.div`
  display: flex;
  flex-direction: ${props => props.vertical ? 'row' : 'column'};
`;

const Secondary = styled.div`
  margin: ${props => props.itemMargin};
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  align-items: center;
`;

const Header = styled.div`
  white-space: nowrap;
  flex-basis: ${props => props.flexBasis};
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.cellWidth};
  height: ${props => props.cellHeight};
  margin: ${props => props.cellMargin};
`;

const Value = styled.div`
  background-color: ${props => props.color};
  opacity: ${props => props.opacityMode
    ? props.score ? (props.score*(1-props.opacityRangeStart)+props.opacityRangeStart) : 0
    : 1 };
  width: ${props => props.sizeMode
    ? props.score ? (Math.sqrt(props.score)*(100-props.sizeRangeStart)+props.sizeRangeStart)+'%' : 0
    : '100%' };
  height: ${props => props.sizeMode
    ? props.score ? (Math.sqrt(props.score)*(100-props.sizeRangeStart)+props.sizeRangeStart)+'%' : 0
    : '100%' };
  border-radius: ${props => props.rounded ? '999rem' : 0};
`;

class Heatmap extends React.Component{
  constructor(props){
    super(props);
  }

  static defaultProps = {
    data: [[],],
    labelsX: [],
    labelsY: [],
    opacityMode: true,
    sizeMode: true,
    classPrefix: 'heatmap',
    dangerousHeaders: false,
  }

  /** Get highest overall value from all values */
  getGlobalMax = () => {
    let max = 0;
    for (const item of this.props.data){
      const localMax = Math.max(...item.values);
      if (localMax > max) max = localMax;
    }
    return max;
  }

  render(){
    const p = this.props;
    return(
      <Primary vertical={p.vertical} className={p.classPrefix+'-primary'}>
        {p.data.map((tag, i) => (
          <Secondary 
            key={i} vertical={p.vertical} 
            className={p.classPrefix+'-secondary'}
            itemMargin={p.itemMargin}
          >
            {tag.headers.map((content,index)=>(
              this.props.dangerousHeaders ? (
                <Header
                  key={index}
                  dangerouslySetInnerHTML={ {__html: content} }
                  className={p.classPrefix+'-header-'+index}
                  flexBasis={p.headerBasis[index]}
                />
              ) : (
                <Header key={index} className={p.classPrefix+'-header-'+index} flexBasis={p.headerBasis[index]}>{content}</Header>
              )
            ))}
            {tag.values.map((val,index)=>(
              <Cell 
                key={index} 
                cellWidth={p.cellWidth} 
                cellHeight={p.cellHeight} 
                cellMargin={p.cellMargin}
                className={p.classPrefix+'-cell'}
              >
                <Value 
                  score={p.globalScale ? val/this.getGlobalMax(): val/Math.max(...tag.values)}
                  color={p.color}
                  opacityMode={p.opacityMode}
                  opacityRangeStart={p.opacityRangeStart}
                  sizeMode={p.sizeMode}
                  sizeRangeStart={p.sizeRangeStart}
                  rounded={p.rounded}
                  className={p.classPrefix+'-value'}
                />
              </Cell>
            ))}
          </Secondary>
        ))}
      </Primary>
    );
  }

}

