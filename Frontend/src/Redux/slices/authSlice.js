import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null,

    loading: false,
    role: JSON.parse(localStorage.getItem('user'))?.accountType || null,
    token: localStorage.getItem("token") || null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: function (state, action) {
            state.loading = action.payload;
        },
        setSignupData: function (state, action) {
            state.signupData = action.payload;
        },
        setToken: function (state, action) {
            state.token = action.payload;
        },
        setRole: function (state, action) {
            state.role = action.payload;
        }
    }

});

export const { setLoading, setSignupData, setToken, setRole } = authSlice.actions;
export default authSlice.reducer; 