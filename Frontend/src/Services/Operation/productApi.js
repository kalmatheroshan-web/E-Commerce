import fetchData from "../../hooks/fetchData";
import { toast } from "sonner";
import { product, auth } from "../api";
import { setLoading, setSignupData, setToken } from "../../Redux/slices/authSlice";

const { CREATE_API, GET_ALLPRODUCT_API, CREATE_REVIEW_API, GET_REVIEW_API } = product;
const { ADD_API, VIEW_ORDER, VIEW_API, DELETE_API, PLACE_ORDER, REMOVE_API, DESCREASE_API, CREATE_ORDER_API, VERIFY_PAYMENT } = auth;

export function createProduct(payload) {
    return async function (dispatch) {
        try {
            dispatch(setLoading(true));
            const response = await fetchData(CREATE_API, 'POST', payload);
            toast.success('inserted successfully');
            return response;
        } catch (error) {
            console.log(error.message);
            toast.error(error.response);
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export function deleteProduct(productId) {
    return async function () {
        try {
            const response = await fetchData(DELETE_API, 'GET', { productId });
            if (response.success) {
                toast.success(response.mes);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }
}

export async function add_To_Cart(navigate, product_id, selectedSize) {
    try {
        const response = await fetchData(ADD_API, 'POST', { id: product_id, size: selectedSize });

        if (navigate && response) {
            navigate('/addToCart', {
                state: { product }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export function viewCart() {
    return async function (dispatch) {
        try {
            const response = await fetchData(VIEW_API, 'GET');
            if (response) {
                dispatch(setSignupData(response?.user));
                return response;
            }
        } catch (error) {
            console.log(error.message);
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
                if (error.response.data.error == 'jwt expired') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    dispatch(setSignupData(null));
                    dispatch(setToken(null));
                }
            }
            toast.error('Please Login first');
        }
    }
}

export async function decreaseCartQuantity(productId, size) {
    try {
        const response = await fetchData(DESCREASE_API, "PUT", {
            productId,
            size,
        });

        if (response) {
            return response;
        }
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
}

export function deleteFromCart(productId, size, stock) {
    return async function (dispatch) {
        try {
            const response = await fetchData(REMOVE_API, 'DELETE', { productId, size, stock });
            if (response) {
                localStorage.setItem('user', JSON.stringify(response.user));
                dispatch(setSignupData(response.user));
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
}

const loadScript = (src) => {
    return new Promise((resolve) => {
        // Prevent duplicate scripts
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Removed the extra inner return function
export async function createOrder(total) {
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Check your connection.");
            return null;
        }

        // Make sure total is converted to paise if your backend expects it
        const response = await fetchData(CREATE_ORDER_API, 'POST', { total });
        console.log(response);

        if (!response || !response.success) {
            toast.error(response?.message || "Failed to create Order ID from server.");
            return null;
        }

        return response; // This now returns the actual data to the caller

    } catch (error) {
        console.error("Payment Error:", error.message);
        toast.error("An unexpected error occurred during order creation.");
        return null;
    }
}

export async function verify_payment(result) {
    try {
        const response = await fetchData(VERIFY_PAYMENT, 'POST', result);
        return response;
    } catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
}

export function placeOrder(orderData) {
    return async function (dispatch) {
        try {
            const response = await fetchData(PLACE_ORDER, 'POST', orderData);
            localStorage.setItem('user', JSON.stringify(response.user));
            dispatch(setSignupData(response.user));
            console.log('user', response.user);
        } catch (error) {
            console.log(error.message);
        }
    }
}

export async function viewOrders() {

    try {
        const response = await fetchData(VIEW_ORDER, 'GET');
        return response;
    }
    catch (error) {
        console.log(error.message);
        return
    }
}

export async function getAllProducts() {
    try {
        const response = await fetchData(GET_ALLPRODUCT_API, 'GET');
        if (response.success)
            return response.products;
    }
    catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
}

export async function createReviews(formdata) {
    try {
        const response = await fetchData(CREATE_REVIEW_API, 'POST', formdata);
        if (response.success) {
            toast.success("Review created successfully");
            return response;
        }
    }
    catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
}

export async function getReviews(productId) {
    try {
        const response = await fetchData(GET_REVIEW_API, 'POST', { productId });
        if (response.success) {
            return response.reviews;
        }
        return [];
    }
    catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
}