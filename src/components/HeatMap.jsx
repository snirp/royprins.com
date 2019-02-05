import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

// TODO cleanup: move to utilities module
const getColorBetween = (colorA, colorB, ratio) => {
  const hex = x => ('0'+x.toString(16)).slice(-2);

  const r = Math.ceil(parseInt(colorA.substring(1,3), 16) * ratio + parseInt(colorB.substring(1,3), 16) * (1-ratio));
  const g = Math.ceil(parseInt(colorA.substring(3,5), 16) * ratio + parseInt(colorB.substring(3,5), 16) * (1-ratio));
  const b = Math.ceil(parseInt(colorA.substring(5,7), 16) * ratio + parseInt(colorB.substring(5,7), 16) * (1-ratio));

  return '#' + hex(r) + hex(g) + hex(b);
};

const scalingStyle = (scaling, val, min, max) => {
  if (scaling === false || scaling === undefined) {
    return {
      height: '100%',
      width: '100%'
    };
  } else if (scaling === true) {
    return {
      height: 100 * Math.sqrt((val - min) / (max - min)) + '%',
      width: 100 * Math.sqrt((val - min) / (max - min)) + '%',
    };
  } else {
    return {
      height: 100 * Math.sqrt((val[scaling] - min[scaling]) / (max[scaling] - min[scaling])) + '%',
      width: 100 * Math.sqrt((val[scaling] - min[scaling]) / (max[scaling] - min[scaling])) + '%',
    };
  }
};

const opacityStyle = (opacity, val, min, max) => {
  if (opacity === false || opacity === undefined) {
    return {opacity: 1};
  } else if (opacity === true) {
    return {opacity: (val - min) / (max - min) };
  } else {
    return {opacity: (val[opacity] - min[opacity]) / (max[opacity] - min[opacity]) };
  }
};

const colorStyle = (color, palette, val) => {
  if (palette) {
    const value = val[palette.dataIndex];
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

const directionMap = {
  top: 'column-reverse'
};

const Container = styled.div(
  {
    display: 'flex',
    alignItems: 'center',
    flexDirection: props => directionMap[props.legend]
  }
);

const Grid = styled.div({
  display: 'flex'
});

const Legend = styled.div({

});

const Shape = styled.div(
  {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: -1,
  },
  props => props.colorStyle,
  props => props.opacityStyle,
  props => props.rounded && { borderRadius: '999rem'},
  props => props.scalingStyle,
  props => props.customStyle
);

const Cell = styled.div(
  {
    position: 'relative',
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  props => props.customStyle
);

const LabelX = styled.div(
  {
    order: props => props.opposite ? 0 : 9999,
  },
  props => props.customStyle
);

const LabelY = styled.div(
  props => props.labelYStyles
);




const HeatMap = (
  {data:{data, valLength, customMin, customMax}, namespace, xAxis, yAxis, cell, shape, legend}) => {
  
  // Treat zLength as a fallback if first data cell is null
  if (Array.isArray(data[0][0])) valLength = data[0][0].length;
  let min;
  let max;

  // For 3d array
  if (valLength){
    // Use custom min and max arrays or default to null-filled array
    min = Array.isArray(customMin) ? customMin : new Array(valLength).fill(null);
    max = Array.isArray(customMax) ? customMax : new Array(valLength).fill(null);

    for(let z=0; z<valLength; z++){
      // TODO performance: check for none-null values before creating a flat array
      let flatZ = [];
      for(let y=0; y<data.length; y++){
        for(let x=0; x<data[y].length; x++){
          if (data[y][x] !== null) flatZ.push(data[y][x][z]);
        }
      }
      min[z] = min[z] === null ? (Math.min(...flatZ)) : min[z];
      max[z] = max[z] === null ? (Math.max(...flatZ)) : max[z];
    }

  // For 2d array
  } else {
    // TODO performance: flat array not needed if both custom min and max are provided
    const flat = data.reduce((acc, cv) => [...acc, ...cv], []).filter(value => value !== null);
    min = isNaN(customMin) ? Math.min(...flat) : customMin;
    max = isNaN(customMax) ? Math.max(...flat) : customMax;
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

  const handleCellClick = (e, val) => {
    cell.onClick(e, val);
  };

  return(
    <Container legend={legend.position}>

      <Grid>
        <div className={`${namespace}y-labels ${namespace}col`} style={heatmapYStyle}>
          <div className={`${namespace}xy`} />
          {yAxis.labels.map((label,i)=>(<div key={i}>{label}</div>))}
        </div>
        {xAxis.labels.map((label,ix)=>(
          <div key={ix} className={`${namespace}col`} style={heatmapColStyle}>
            {xAxis.dangerousLabels ? (
              <LabelX opposite={xAxis.opposite} dangerouslySetInnerHTML={{__html: label}} className={`${namespace}x-label`} customStyle={xAxis.customStyle}/>
            ) : (
              <LabelX opposite={xAxis.opposite} className={`${namespace}x-label`} customStyle={xAxis.customStyle}>{label}</LabelX>
            )}
            {yAxis.labels.map((_,iy) => {
              const val = data[iy][ix];
              return(
                <Cell 
                  key={iy} 
                  className={`${namespace}cell ${namespace}cell-${ix}-${iy}`} 
                  customStyle={cell.customStyle}
                  onClick={val !== null ? (e)=>handleCellClick(e, val) : undefined }
                >
                  {val !== null && cell.content && cell.content(val)}
                  {val !== null && (
                    <Shape
                      colorStyle={colorStyle(shape.color, shape.palette, val)} 
                      opacityStyle={opacityStyle(shape.opacity, val, min, max)}
                      scalingStyle={scalingStyle(shape.scaling, val, min, max)}
                      rounded={shape.rounded}
                      customStyle={shape.customStyle && shape.customStyle(val, min, max)} 
                    />
                  )}
                </Cell>
              );
            })}
          </div>
        ))}
      </Grid>

      {legend && (
        <Legend>hallllooo
        </Legend>
      )}

    </Container>
  );
};

HeatMap.defaultProps = {
  xAxis: {
    display: true,
    opposite: false,
    dangerousLabels: false,
  },
  yAxis: {
    display: true,
    opposite: false,
    dangerousLabels: false,
  },
};

HeatMap.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf( // A 2D array of numbers, `null` or arrays of numbers (=3D array)
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.number, 
          PropTypes.oneOf([null]),
          PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]))
        ])
      )
    ).isRequired,
    valLength: PropTypes.number, // In case the first cell has a `null` value, this will give the length of the values array
    customMin: PropTypes.oneOfType([
      PropTypes.number, 
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]))
    ]), // Absent these, the `min` and `max` values are derived from the dataset
    customMax: PropTypes.oneOfType([
      PropTypes.number, 
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]))
    ]), // Absent these, the `min` and `max` values are derived from the dataset
  }),
  namespace: PropTypes.string, // String to prepend to class-names 
  xAxis: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string), // Array of labels
    display: PropTypes.bool, // Display the labels
    labelHeight: PropTypes.string, // Length value for flexBasis
    columnWidth: PropTypes.string, // Length value for flexBasis
    labelRotation: PropTypes.number, // Clockwise rotation in degrees
    opposite: PropTypes.bool, // Display on opposite side
    customStyle: PropTypes.object, // Custom styles to merge (takes precedence over other styles)
    dangerousLabels: PropTypes.bool, // Allow HTML content in labels
  }),
  yAxis: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string), // Array of labels
    display: PropTypes.bool, // Display the labels
    labelWidth: PropTypes.string, // Length value for flexBasis
    rowHeight: PropTypes.string, // Length value for flexBasis
    labelRotation: PropTypes.number, // Clockwise rotation in degrees
    opposite: PropTypes.bool, // Display on opposite side
    customStyle: PropTypes.object, // Custom styles to merge (takes precedence over other styles)
    dangerousLabels: PropTypes.bool, // Allow HTML content in labels
  }),
  cell: PropTypes.shape({
    content: PropTypes.func, // Take value (or array of values) and render cell content
    customStyle: PropTypes.object, // Custom styles to merge with cell style
    onMouseOver: PropTypes.func, // MouseOver handler for cell, takes `event` and `val` (number or array when 3D)
    onMouseLeave: PropTypes.func, // MouseLeave handler for cell, takes `event` and `val` (number or array when 3D)
    onClick: PropTypes.func, // Click handler for cell, takes `event` and `val` (number or array when 3D)
  }),
  shape: PropTypes.shape({
    scaling: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]), // Use value to scale shape: true for 2D array or index number for 3D array
    rounded: PropTypes.bool, // Display shape as circle or rounded rectangle
    opacity: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),  // Use value for opacity of shape: true for 2D array or index number for 3D array
    color: PropTypes.string, // Background (Hex)color of shape. eg. '#FF05A4'
    palette: PropTypes.shape({ // Palette with color stops instead of single color
      dataIndex: PropTypes.number, // Index number of dataset to use. Can be omitted for 2D array
      gradient: PropTypes.bool, // Display intermediate color values or round to closest stop
      palette: PropTypes.arrayOf( PropTypes.shape({
        stop: PropTypes.number, // Color stop value
        color: PropTypes.string, // Color associated with stop
      }))
    }),
    customStyle: PropTypes.func, // Take `val`, `min`, `max` (=number or array when 3D) and generate shape styles to merge.
  }),
  legend: PropTypes.shape({
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),

  })
};

export default HeatMap;
