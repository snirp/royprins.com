import React from 'react';
import styled from '@emotion/styled';

const data = [
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [10,5,3,1,0,0,0,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,6,6,6,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,0,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,2,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,0,0],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,0,0],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,0,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,3,1,0,0,6,0,1,0,0],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,6,0,2,0,0,0,2,1],
  },
  {
    headers: ['Q','React<strong>JS</strong>'],
    values: [0,5,3,1,0,0,6,0,2,1],
  },
  {
    headers: ['VV','Vue'],
    values: [5,3,1,0,2,0,6,0,2,1],
  },
];

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
  /* TODO: width and height are duplicates -> DRY */
  width: ${props => props.sizeMode
    ? props.score ? (Math.sqrt(props.score)*(100-props.sizeRangeStart)+props.sizeRangeStart)+'%' : 0
    : '100%' };
  height: ${props => props.sizeMode
    ? props.score ? (Math.sqrt(props.score)*(100-props.sizeRangeStart)+props.sizeRangeStart)+'%' : 0
    : '100%' };
  border-radius: ${props => props.rounded ? '999rem' : 0};
`;

export default class Heatmap extends React.Component{
  constructor(props){
    super(props);
  }

  /** Get highest overall value from all values */
  // TODO performance: Only execute when componentWillReceiveProps
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
                  dangerouslySetInnerHTML={ {__html: content} }
                  className={p.classPrefix+'-header-'+index}
                  flexBasis={p.headerBasis[index]}
                />
              ) : (
                <Header className={p.classPrefix+'-header-'+index} flexBasis={p.headerBasis[index]}>{content}</Header>
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

  // Set default props
  static defaultProps = {
    data: data, 
    vertical: false, 
    itemMargin: '6px',
    cellWidth: '30px', 
    cellHeight: '30px', 
    cellMargin: '0',
    color: 'purple', 
    opacityMode: true,
    opacityRangeStart: 0, // 0 to 1
    sizeMode: true,
    sizeRangeStart: 0, // 0 to 100
    globalScale: false,
    rounded: false,
    classPrefix: 'heatmap',
    headerBasis: ['',], // length for equal spacing of name (may esp. be useful when horizontal)
    dangerousHeaders: true, // Parse html headers
  }

}

