import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import productReducer from '../slices/productSlice';
import ordersReducer from '../slices/orderSlice'; 

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer, 
        orders  : ordersReducer
    }
});

export default store; 
