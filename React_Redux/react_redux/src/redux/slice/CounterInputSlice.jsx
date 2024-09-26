import {createSlice} from "@reduxjs/toolkit"

const counterInputSlice = createSlice({
    name: "counterInputSlice",
    initialState: {
        count:0,
        delta:1
    },
    reducers:{
        increment: (state)=>{
            state.count+=state.delta;
        },
        decrement: (state)=>{
            state.count-=state.delta;
        },
        updateDelta: (state, params)=>{
            //to access just params.payload
            const delta= params.payload;
            state.delta=delta;
            console.log("17", params.payload);
        }
    }
})
export default counterInputSlice;
