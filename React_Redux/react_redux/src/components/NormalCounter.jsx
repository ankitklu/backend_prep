import React, { useState } from 'react'

function NormalCounter() {

  const [count, setCount]= useState(0);

  const increment=()=>{
    setCount(count+1);
  }
  const decrement=()=>{
    setCount(count-1);
  }

  return (
    <>
      <button onClick={increment}>+</button>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
    </>
  )
}

export default NormalCounter