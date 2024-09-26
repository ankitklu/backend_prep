import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import counterInputSlice from '../redux/slice/CounterInputSlice';
const actions= counterInputSlice.actions;

function ReduxInputCounter() {

    const  {count, delta} = useSelector((store)=> store.counterInputSlice);
    const dispatch= useDispatch();

  const [value, setValue]= useState("");

  const increment=()=>{
    // setCount(count+delta);
    dispatch(actions.increment());
  }
  const decrement=()=>{
    // setCount(count-delta);
    dispatch(actions.decrement());
  }

  const setDeltaFn=()=>{
    // setDelta(Number(value));
    dispatch(actions.updateDelta(Number(value)));
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

export default ReduxInputCounter;