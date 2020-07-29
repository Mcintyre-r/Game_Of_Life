import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import './App.css'
import logo from './assets/hasbro.png'
import Switch from "react-switch";

const numRows = 25;
const numCols = 25;
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
  const [prev, setPrev] = useState([0,0])
  const [running, setRunning] = useState(false);
  const [line, setLine] = useState(true)
  const [gen, setGen] = useState(0)







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

    setGen(g => g+1)
    setTimeout(runSimulation, 500)
  },[])


  const stepForward = (g, n, gen) => {
  
      const newGrid = produce(g, gridCopy => {
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
      n -=1
      gen += 1
      if(n !== 0) {
        stepForward(newGrid, n, gen)
      } else {
        setGen(g => gen)
        setGrid(newGrid)
      }
  }

  const plotLine = (x0, y0, x1, y1, grid) => {
    const dx =  Math.abs(x1-x0);
    const sx = x0<x1 ? 1 : -1;
    const dy = -Math.abs(y1-y0);
    const sy = y0<y1 ? 1 : -1;
    let err = dx+dy; 
    while (true) {
      grid[x0][y0] = line
      if (x0===x1 && y0===y1) {
        break
      }
      let e2 = 2*err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
      
    }
      
}


function handleChange() {
  setLine(!line)
}
  return (
    <>
    <div className='wrap'>
      <div className='wrap box'>
        <div className='wrap box' style={{justifyContent: 'left', fontSize:14, color:'#FF5733', alignItems:'center'}}>
          <div style={{paddingRight:4}}>Erase</div> 
          <Switch onChange={() => handleChange()} checked={line} onColor='FF5733' checkedIcon={false} uncheckedIcon={false} height={11} width={20}/>
          <div style={{paddingLeft:4, paddingRight: 10}}>Draw</div>
        </div>
        <div className='wrap box'style={{justifyContent: 'flex-end', fontSize:14, color:'#FF5733'}}>
          <div>{`Generation: ${gen}`}</div>
        </div>
      </div>
      <div className='box'></div>
    </div>
    <div className='wrap'>
      <div className='box ref'  style={{ border: '1px solid rgba(255,255,255, .5)',display:'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}>
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
                    if(!running){
                      const newGrid = produce(grid, gridCopy => {
                        gridCopy[i][k]= grid[i][k]? 0:1;
                      })
                      setGrid(newGrid)
                    }
                  }}
                  onMouseOver={(e)=>{
                    if(!running){
                      if((e.buttons&1) === 1){
                        const newGrid = produce(grid, gridCopy => {
                          plotLine(prev[0], prev[1], i, k,gridCopy)
                          gridCopy[i][k]= line ? 1: 0;
                        })
                        setGrid(newGrid)
                      }
                      setPrev([i,k])
                    }   
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
                    if(!running){
                      const newGrid = produce(grid, gridCopy => {
                        gridCopy[i][k]= grid[i][k]? 0:1;
                      })
                      setGrid(newGrid)
                    }
                  }}
                  onMouseOver={(e)=>{
                    if(!running){
                      if((e.buttons&1) === 1){
                        const newGrid = produce(grid, gridCopy => {
                          plotLine(prev[0], prev[1], i, k,gridCopy)
                          gridCopy[i][k]= line ? 1: 0;
                        })
                        setGrid(newGrid)
                      }
                      setPrev([i,k])  
                    } 
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
                    if(!running){
                      const newGrid = produce(grid, gridCopy => {
                        gridCopy[i][k]= grid[i][k]? 0:1;
                      })
                      setGrid(newGrid)
                    }
                  }}
                  onMouseOver={(e)=>{
                    if(!running){
                      if((e.buttons&1) === 1){
                        const newGrid = produce(grid, gridCopy => {
                          plotLine(prev[0], prev[1], i, k,gridCopy)
                          gridCopy[i][k]= line ? 1: 0;
                        })
                        setGrid(newGrid)
                      }
                      setPrev([i,k])   
                    }
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
        <img src={logo} alt='logo'/>

        <ul style={{marginBottom: '30px'}}>
          <li style={{textAlign: 'left', marginBottom: '30px', fontSize:20}}>Live cells with less than two live neighbours dies by underpopulation.</li>
          <li style={{textAlign: 'left', marginBottom: '30px', fontSize:20}}>Live cells with two to three live neighbours live on.</li>
          <li style={{textAlign: 'left', marginBottom: '30px', fontSize:20}}>Live cells with more than three live neighbours die by overpopulation.</li>
          <li style={{textAlign: 'left', marginBottom: '30px', fontSize:20}}>Dead cell with three live neighbours becomes a live cell.</li>
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
    <div className='wrap box' style={{fontSize:14, color:'#FF5733', justifyContent:'left'}}>*click or drag to toggle cells live or dead</div>
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
        setGen(0)
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
          setGen(0)
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        random</div>
        <div className='buttonNorm' onClick={()=>{
        stepForward(grid, 1, gen)
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Step</div>
        <div className='buttonNorm' onClick={()=>{
        stepForward(grid, 5, gen)
      }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Step 5</div>
    </div>
   
    </>
  );
}

export default App;
