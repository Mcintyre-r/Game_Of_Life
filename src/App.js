import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import './App.css'
import logo from './assets/hasbro.png'


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
            let neighbors = 0;
            operations.forEach(([x,y]) => {
              
              const newI = i + x;
              const newK = k + y;
              
              if (newI >=0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbors += grid[newI][newK];
              }
            });

            if (neighbors < 2){
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
                    backgroundColor: grid[i][k] ? '#F98B73': undefined,
                  }}
                />
              )
            } else if( neighbors >3){
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
                    backgroundColor: grid[i][k] ? '#941B00': undefined,
                  }}
                />
              )
            } else{
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
                    backgroundColor: grid[i][k] ? '#FF5733': undefined,
                  }}
                />
              )
            }
            
            })
      )}
      </div>
      <div className='box'>
        {/* <h1 style={{marginBottom: '40px'}}>Conway's Game of Life</h1> */}
        <img src={logo}/>

        <ul style={{marginBottom: '30px'}}>
          <li style={{textAlign: 'left', marginBottom: '30px'}}>Live cells with less than two live neighbours dies by underpopulation.</li>
          <li style={{textAlign: 'left', marginBottom: '30px'}}>Live cells with two to three live neighbours live on.</li>
          <li style={{textAlign: 'left', marginBottom: '30px'}}>Live cells with more than three live neighbours die by overpopulation.</li>
          <li style={{textAlign: 'left', marginBottom: '30px'}}>Dead cell with three live neighbours becomes a live cell.</li>
        </ul>
        <div style={{display: 'flex', alignItems: 'center',justifyContent: 'space-around'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
          <div style={{
                    borderRadius: '50%',
                    margin: '0 10px',
                    width:20,
                    height:20,
                    backgroundColor:'#FF5733',
                  }}/>
          <div>Living</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
          <div style={{
                    borderRadius: '50%',
                    margin: '0 10px',
                    width:20,
                    height:20,
                    backgroundColor:'#F98B73',
                  }}/>
          <div>Under Populated</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
          <div style={{
                    borderRadius: '50%',
                    width:20,
                    height:20,
                    backgroundColor:'#941B00',
                  }}/>
          <div>Over Populated</div>
          </div>
        </div>
 
          
          
          
        
      </div>
    </div>
    <div className='wrap' style={{fontSize:10, color:'#FF5733', justifyContent:'left'}}>*click to toggle cells live or dead</div>
    <div className='wrap'>
      <div className={running? 'button': 'buttonNorm'} onClick={()=>{
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
        {running? "stop.":"start"}</div>
      <div className='buttonNorm' onClick={()=>{
        setGrid(generateEmptyGrid())
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        clear</div>
      <div className='buttonNorm' onClick={()=>{
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
        <div className='buttonNorm' onClick={()=>{
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
