import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import './App.css'


const numRows = 20;
const numCols = 20;
const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]
]
let rainbow = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);


const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};
function App() {
  const [grid, setGrid] = useState(()=>{
    return generateEmptyGrid()
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running
  const runSimulation = useCallback(()=>{
    if(!runningRef.current){
      return
    }
    setGrid((g)=>{
      return produce(g, gridCopy => {
        for(let i = 0; i< numRows; i++){
          for(let k = 0; k <numCols; k++){
            let neighbors = 0;
            operations.forEach(([x,y]) => {
              
              const newI = i + x;
              const newK = k + y;
              
              if (newI >=0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors >3){
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k]=1
            }
          }
        }
      })
    })


    setTimeout(runSimulation, 500)
  },[])


  const stepForward = () => {
    setGrid((g)=>{
      return produce(g, gridCopy => {
        for(let i = 0; i< numRows; i++){
          for(let k = 0; k <numCols; k++){
            let neighbors = 0;
            operations.forEach(([x,y]) => {
              
              const newI = i + x;
              const newK = k + y;
              
              if (newI >=0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors >3){
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k]=1
            }
          }
        }
      })
    })
  }
  // console.log(grid)
  return (
    <>
    <div className='wrap'>
      <div className='box ref'style={{ border: '1px solid rgba(255,255,255, .5)',display:'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}>
        {grid.map((rows,i) => 
          rows.map((col,k) => {
            let rainbow = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
            return(
          <div
            key={`${i}-${k}`}
            onClick={()=>{
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k]= grid[i][k] ? 0 : 1;
              })
              setGrid(newGrid)
            }}
            className={`cellHov ${grid[i][k] ? 'cell':undefined}`}
            style={{
              width:20,
              height:20,
              // border: grid[i][k] ? `solid 1px ${rainbow}`: undefined,
              backgroundColor: grid[i][k] ? rainbow: undefined,
            }}
          />
        )})
      )}
      </div>
      <div className='box'>
        <h1>Conway's</h1>
        <h2>Game of Life</h2>
        <ul>
          <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ul>
      </div>
    </div>
    <div className='wrap'>
      <div className='button' onClick={()=>{
        setRunning(!running);
        if(!running){
          runningRef.current = true;
          runSimulation();
        }
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {running? "stop":"start"}</div>
      <div className='button' onClick={()=>{
        setGrid(generateEmptyGrid())
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        clear</div>
      <div className='button' onClick={()=>{
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)));
          }

          setGrid(rows)
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        random</div>
        <div className='button' onClick={()=>{
        stepForward()
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Step</div>
    </div>
   
    </>
  );
}

export default App;
