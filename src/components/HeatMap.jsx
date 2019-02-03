import React from 'react';

export default ({
  labelsX=['aap', 'noot', 'mies', 'boom'],
  labelsY=['ma', 'dinsdag', 'wo'],
  dataA=[
    [0,1,0,3],
    [4,5,1,0],
    [2,2,2,2],
  ],
  dataB=[
    [0,1,0,3],
    [4,5,1,0],
    [2,2,2,2],
  ],
  classPrefix='heatmap',
  cellContent=(valueA, valueB)=>(String(valueA)),
  cellStyle=(valueA, minA, maxA, valueB, minB, maxB)=>({}),
  shapeStyle=(valueA, minA, maxA, valueB, minB, maxB)=>({
    height: Math.sqrt((valueA - minA) / (maxA - minA)) + '%',
    width: Math.sqrt((valueA - minA) / (maxA - minA)) + '%',
    color: 'green',
    opacity: (valueB - minB) / (maxB - minB),
  }),
  dangerousLabels=false,
  classForValue,
  onMouseOver,
  onMouseLeave,
  onClick,
}) => {
  const flatA = dataA.reduce((acc, cv) => [...acc, ...cv], []);
  const minA = Math.min(...flatA);
  const maxA = Math.max(...flatA);
  const flatB = dataB.reduce((acc, cv) => [...acc, ...cv], []);
  const minB = Math.min(...flatB);
  const maxB = Math.max(...flatB);

  const heatmapStyle = {
    display: 'flex',
  };

  const heatmapYStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const heatmapColStyle = {
    display: 'flex',
    flexDirection: 'column',
  };


  return(
    <div className={classPrefix} style={heatmapStyle}>
      <div className={classPrefix+'-y '+classPrefix+'-col'} style={heatmapColStyle}>
        <div className={classPrefix+'-zero'} />
        {labelsY.map((labelY,i)=>(<div key={i}>{labelY}</div>))}
      </div>
      {labelsX.map((labelX,ix)=>(
        <div key={ix} className={classPrefix+'-col'} style={heatmapColStyle}>
          <div className={classPrefix+'-x'}>{labelX}</div>
          {labelsY.map((_,iy)=>{
            const valueA = dataA[iy][ix];
            const valueB = dataB[iy][ix];
            const cellStyleObj = Object.assign(
              {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              cellStyle(valueA, minA, maxA, valueB, minB, maxB)
            );
            const shapeStyleObj = Object.assign(
              {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                zIndex: -1,
              },
              shapeStyle(valueA, minA, maxA, valueB, minB, maxB)
            );
            return(
              <div className={classPrefix+'-cell '+classPrefix+'-cell-'+ix+'-'+iy} style={cellStyleObj}>
                {cellContent(valueA, valueB)}
                <div className={classPrefix+'-shape'} style={shapeStyleObj} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};



