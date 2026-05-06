import fetchData from "../../hooks/fetchData";
import { toast } from "sonner";
import { setLoading, setSignupData, setToken, setRole } from "../../Redux/slices/authSlice";
import { auth } from '../api';
const { LOGIN_API, VERIFY_API, SENDOTP_API, SIGNUP_API, CHANGE_PASSWORD_API, EDIT_ADDRESS_API } = auth;

export function login(email, password, navigate) {
    return async function (dispatch) {
        dispatch(setLoading(true));
        try {
            const response = await fetchData(LOGIN_API, "POST", { email, password });

            if (response.email == email) {
                navigate('/verify-otp', {
                    state: { email }
                });
            }
            else {
                console.log("Login failed:", response?.mes);
            }
        } catch (error) {
            console.log("error while login", error.message);
            toast.error(error?.response.data.mes);
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export function verify_otp(email, otp, navigate) {
    return async function (dispatch) {
        try {
            const response = await fetchData(VERIFY_API, "POST", { email, otp });
            if (response) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                dispatch(setToken(response.token));
                dispatch(setSignupData(response.user));

                if (response.user.accountType == 'customer') {
                    dispatch(setRole('customer'));
                    navigate('/');
                }
                else if (response.user.accountType == 'admin') {
                    dispatch(setRole('admin'));
                    navigate('/admin');
                }
                else {
                    dispatch(setRole('seller'));
                    navigate('/seller');
                }
            }

        } catch (error) {
            console.log("error while otp verification", error.message);
            toast.error(error.response.mes);
        }
    }
}

export async function sendOtp(email) {
    try {
        await fetchData(SENDOTP_API, "POST", { email });
    } catch (error) {
        console.log(error.message);
        toast.success('error while sending otp');
    }
}

export function sendOtp_forget(email, navigate) {
    return async function () {
        setLoading(true);
        try {
            const response = await fetchData(SENDOTP_API, "POST", { email });
            if (response) {
                navigate('/forgot-password/otp', { state: { email } });
            }

        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }
}

export function verify_forgetOtp(email, otp, navigate) {
    return async function () {
        setLoading(true);
        try {
            const response = await fetchData(VERIFY_API, "POST", { email, otp });
            if (response) {
                navigate('/forgot-password/reset', { state: { email } });
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }
}

export function changePassword(email, password, navigate) {
    return async function () {
        setLoading(true);
        try {
            const response = await fetchData(CHANGE_PASSWORD_API, 'POST', { email, password });
            if (response) {
                navigate('/login');
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setSignupData(null));

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");

        if (navigate) {
            navigate("/");
        }
    };
}

export function signUp(navigate, email, password, firstName, lastName, accountType = undefined) {
    return async function (dispatch) {
        dispatch(setLoading(true));
        try {
            let obj = { email, password, firstName, lastName, accountType };
            const response = await fetchData(SIGNUP_API, 'POST', obj);


            console.log(response);
            if (response) {
                await dispatch(setSignupData(response.user));
                localStorage.setItem('user', JSON.stringify(response.user))
                navigate('/');
            }

        } catch (error) {

            if (error.response?.status == 409)
                toast.error(`${(error.response?.data?.mes)}`);
            else
                console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export function editAddress(payload) {
    return async function (dispatch) {
        try {
            console.log("called");
            const res = await fetchData(EDIT_ADDRESS_API, 'PUT', payload);

            localStorage.setItem('user', JSON.stringify(res.user));
            dispatch(setSignupData(res.user));
            toast.success('Address Updated Successfully');
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }
}