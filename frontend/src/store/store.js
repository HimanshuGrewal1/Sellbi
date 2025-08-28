import { configureStore } from '@reduxjs/toolkit';
import cardReducer from "../store/Cart";



export const store = configureStore({
  reducer: {
    card: cardReducer, 
  }

});
 