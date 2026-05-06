import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
    },
    reducers: {
        setOrder: function (state, action) {
            state.orders = action.payload;
        }
    },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;