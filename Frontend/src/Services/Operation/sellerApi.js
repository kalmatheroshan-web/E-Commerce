import { product } from "../api";
import fetchData from "../../hooks/fetchData";
const { GET_ALL_SELLER_PRODUCT_API, GET_ALLORDERS } = product;
import toast from 'react-hot-toast';

export function getAllSellerProducts() {
    return async function () {
        try {
            const response = await fetchData(GET_ALL_SELLER_PRODUCT_API, 'GET');
            if (response.success)
                return response.products;
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }
}

export async function getAllOrders() {
    try {
        const response = await fetchData(GET_ALLORDERS, 'GET');
        if (response.success)
            return response.orders;
    } catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
}
