import React, { useState } from 'react'

function NormalInputCounter() {

  const [count, setCount]= useState(0);
  const [delta, setDelta]= useState(1);
  const [value, setValue]= useState("");

  const increment=()=>{
    setCount(count+delta);
  }
  const decrement=()=>{
    setCount(count-delta);
  }

  const setDeltaFn=()=>{
    setDelta(Number(value));
  }

  return (
    <>
        <div>
            <input type="number" placeholder='Input your delta num' value={value} onChange={(e)=> setValue(e.target.value)}></input>
            <button onClick={setDeltaFn}>DELTA</button>
        </div>
      <button onClick={increment}>+</button>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
    </>
  )
}

export default NormalInputCounter