import fetchData from "../../hooks/fetchData";
import toast from 'react-hot-toast';
import { auth } from '../api';

const { UPDATE_STATUS_API } = auth;

export async function updateOrderStatus({ orderId, status }) {
    try {
        const response = await fetchData(UPDATE_STATUS_API, 'POST', { orderId, status });
        if (response.success) {
            toast.success(response.message);
        }
    } catch (error) {
        console.log(error);
    }
}