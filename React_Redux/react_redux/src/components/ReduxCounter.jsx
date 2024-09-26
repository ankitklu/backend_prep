import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import counterSlice from '../redux/slice/CounterSlice';
import store from '../redux/store';
const actions =  counterSlice.actions;


function ReduxCounter() {

  const count = useSelector((store)=> store.counterState.count);
  const dispatch= useDispatch();
  // console.log("count", count);

  const increment=()=>{
    dispatch(actions.increment());
  }
  const decrement=()=>{
    dispatch(actions.decrement());
  }
    

  return (
    <>
      <button onClick={increment}>+</button>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
    </>
  )
}

export default ReduxCounter;