import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: { products: [] },
    reducers: {
        setProduct: (state, action) => {
            const payload = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];

            state.products.push(...payload);
        }
    }
});


export const { setProduct } = productSlice.actions;
export default productSlice.reducer; 