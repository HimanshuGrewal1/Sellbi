import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'




const initialState = {
  cardItems:[]
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
       addToCard:(state,action) =>{
             const existingItem=state.cardItems.find(item=>item._id===action.payload._id);
             if(!existingItem){
                state.cardItems.push(action.payload)
                Swal.fire({
                  title: "Item added successfully!",
                  icon: "success",
                  draggable: true
                });
             } else{
              Swal.fire({
                icon: "error",
                title: "",
                text: "Item already exists",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
             }
       },
       removeFromCard:(state,action)=>{
          state.cardItems= state.cardItems.filter(items=>items._id!==action.payload._id)
         
       },
       clearCard:(state)=>{
          state.cardItems=[]
       }
  },
})


export const {addToCard,removeFromCard,clearCard } = cardSlice.actions;

export default cardSlice.reducer;