import React from 'react';
import styled from '@emotion/styled';

const colPart = {
  display: 'flex',
  flexDirection: 'column',
};

// TODO cleanup: move to utilities module
const getColorBetween = (colorA, colorB, ratio) => {
  const hex = x => ('0'+x.toString(16)).slice(-2);

  const r = Math.ceil(parseInt(colorA.substring(1,3), 16) * ratio + parseInt(colorB.substring(1,3), 16) * (1-ratio));
  const g = Math.ceil(parseInt(colorA.substring(3,5), 16) * ratio + parseInt(colorB.substring(3,5), 16) * (1-ratio));
  const b = Math.ceil(parseInt(colorA.substring(5,7), 16) * ratio + parseInt(colorB.substring(5,7), 16) * (1-ratio));

  return '#' + hex(r) + hex(g) + hex(b);
};

const shapeSizeStyle = (scaledShape, val, min, max) => {
  if (scaledShape === false) {
    return {
      height: '100%',
      width: '100%'
    };
  } else if (scaledShape === true) {
    return {
      height: 100 * Math.sqrt((val - min) / (max - min)) + '%',
      width: 100 * Math.sqrt((val - min) / (max - min)) + '%',
    };
  } else {
    return {
      height: 100 * Math.sqrt((val[scaledShape] - min[scaledShape]) / (max[scaledShape] - min[scaledShape])) + '%',
      width: 100 * Math.sqrt((val[scaledShape] - min[scaledShape]) / (max[scaledShape] - min[scaledShape])) + '%',
    };
  }
};

const shapeOpacityStyle = (opacity, val, min, max) => {
  if (opacity === false) {
    return {opacity: 1};
  } else if (opacity === true) {
    return {opacity: (val - min) / (max - min) };
  } else {
    return {opacity: (val[opacity] - min[opacity]) / (max[opacity] - min[opacity]) };
  }
};

const shapeColorStyle = (color, palette, val) => {
  if (palette) {
    const value = val[palette.dataSet];
    // Fallback for value larger than stops 
    let bgColor = palette.palette[palette.palette.length-1].color;
    let lower;
    for(let i = 0; i < palette.palette.length; i++){
      let upper = palette.palette[i];
      if (value < upper.stop) {
        if (lower) {
          bgColor = getColorBetween(lower.color, upper.color, (value-lower.stop)/(upper.stop-lower.stop));
        } else {
          // Fallback for value smaller than stops
          bgColor = upper.color;
        }
        break;
      }
      lower = upper;
    }
    return {backgroundColor: bgColor};
  } else if (color) {
    return {backgroundColor: color};
  } else {
    return {};
  }
};


const Shape = styled.div(
  {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 0,
  },
  props => props.colorStyle,
  props => props.opacityStyle,
  props => props.rounded && { borderRadius: '999rem'},
  props => props.sizeStyle,
  props => props.customStyle
);

const LabelX = styled.div(
  props => props.labelXStyle
);

const LabelY = styled.div(
  props => props.labelYStyle
);

const Grid = styled.div(
  {
    display: 'flex'
  }
);



export default ({
  labelsX=['app app', 'noot', 'mies', 'boom'],
  labelsY=['ma', 'dinsdag', 'wo'],
  data=[
    [[0.0,13],[1.0,10],[0.3,20],[0.3,22]],
    [[0.2,17],[0.8,15],[0.4,20],[0.6,10]],
    [[0.1,11],[0.7,29],[0.3,27],[0.1,43]],
  ],
  namespace='heatmap-',
  scaledShape=false,  // false, true, 0...n
  opacity=false, // false, true, 0...n
  roundedShape=false,
  color='green',
  palette={
    dataSet: 0,
    palette: [
      {stop: 0, color: '#CAE8B4'},
      {stop: 0.5, color: '#208FC6'},
      {stop: 1, color: '#FFFFDA'},
    ],
    gradient: false,
  },
  cellContent=(val)=>(String(val[0])),
  labelYStyle={
    flexBasis: 200,
  },
  labelXStyle={
    flexBasis: 50,
  },
  cellStyle=(val, min, max)=>({
    lineHeight: '1.8rem',
  }),
  shapeStyle=(val, min, max)=>({}),
  dangerousLabels=true,
  onMouseOver,
  onMouseLeave,
  onClick=(val)=>{
    window.alert(val);
  },
}) => {

  let min;
  let max;
  if (Array.isArray(data[0][0])){
    min = [];
    max = [];
    for(let z=0; z<data[0][0].length; z++){
      let flat = [];
      for(let y=0; y<data.length; y++){
        for(let x=0; x<data[y].length; x++){
          flat.push(data[y][x][z]);
        }
      }
      min.push(Math.min(...flat));
      max.push(Math.max(...flat));
    }
  } else {
    const flat = data.reduce((acc, cv) => [...acc, ...cv], []);
    min = Math.min(...flat);
    max = Math.max(...flat);
  }

  const heatmapColStyle = {
    display: 'flex',
    flexDirection: 'column',
  };


  const heatmapYStyle = {
    display: 'flex',
    flexDirection: 'column',  // combine with ColStyle when using classes
    alignItems: 'flex-end',
  };

  const handleClick = (e, val) => {
    onClick(val);
  };

  return(
    <Grid>
      <div className={`${namespace}y-labels ${namespace}col`} style={heatmapYStyle}>
        <div className={`${namespace}x-label`} />
        {labelsY.map((labelY,i)=>(<div key={i}>{labelY}</div>))}
      </div>
      {labelsX.map((labelX,ix)=>(
        <div key={ix} className={`${namespace}col`} style={heatmapColStyle}>
          {dangerousLabels ? (
            <LabelX dangerouslySetInnerHTML={{__html: labelX}} className={`${namespace}x-label`} labelXStyle={labelXStyle}/>
          ) : (
            <LabelX className={`${namespace}x-label`} labelXStyle={labelXStyle}>{labelX}</LabelX>
          )}
          {labelsY.map((_,iy)=>{
            const val = data[iy][ix];
            const cellStyleObj = Object.assign(
              {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              cellStyle(val, min, max)
            );
            return(
              <div 
                key={iy} 
                className={`${namespace}cell ${namespace}cell-${ix}-${iy}`} 
                style={cellStyleObj}
                onClick={(e)=>handleClick(e, val)}
              >
                {cellContent(val)}
                <Shape
                  colorStyle={shapeColorStyle(color, palette, val)} 
                  opacityStyle={shapeOpacityStyle(opacity, val, min, max)}
                  sizeStyle={shapeSizeStyle(scaledShape, val, min, max)}
                  rounded={roundedShape}
                  customStyle={shapeStyle(val, min, max)} 
                />
              </div>
            );
          })}
        </div>
      ))}
    </Grid>
  );
};



