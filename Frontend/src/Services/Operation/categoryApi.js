import { toast } from "sonner";
import fetchData from "../../hooks/fetchData";
import { category } from "../api";
const { READ_API, CREATE_CAT_API, VIEW_COUPONS_API, DELETE_CAT_API, CREATE_COUPONS_API, DELETE_COUPONS_API } = category;

export async function viewCategory() {
    try {
        const response = await fetchData(READ_API, 'GET');
        return response.categories;
    } catch (error) {
        console.log(error.message);
        toast.error(`${(error.response?.data?.mes)}`);
    }
}

export async function createCategory({ categoryName }) {
    try {
        const response = await fetchData(CREATE_CAT_API, 'POST', { categoryName });
        if (response.success)
            return response.data;
    } catch (error) {
        console.log(error.message);
        toast.error(`${(error.response?.data?.mes)}`);
    }
}
export async function deleteCategory({ categoryName }) {
    try {
        const response = await fetchData(DELETE_CAT_API, 'DELETE', { categoryName });
        if (response.success)
            return response.data;
    } catch (error) {
        console.log(error.message);
        toast.error(`${(error.response?.data?.mes)}`);
    }
}

export async function viewCoupons() {
    try {
        const response = await fetchData(VIEW_COUPONS_API, 'GET');
        return response.data;
    } catch (error) {
        console.log(error.message);
        toast.error(`${(error.response?.data?.mes)}`);
    }
}

// Create a new coupon
export async function createCoupons(couponData) {
    try {
        const response = await fetchData(CREATE_COUPONS_API, 'POST', couponData);

        console.log('CREATE COUPON API RESPONSE:', response);

        if (!response?.success) {
            const message = response?.data?.message || 'Failed to create coupon';
            toast.error(message);
            throw new Error(message); // stop execution properly
        }
        toast.success(response.message);

        return response.data;
    } catch (error) {
        console.error('Create Coupon Error:', error);
        toast.error(error.message || 'Something went wrong');
        throw error;
    }
}

// Delete a coupon
export async function deleteCoupon(couponId) {
    try {
        const response = await fetchData(DELETE_COUPONS_API, 'DELETE', { couponId });
        if (!response.success) {
            throw new Error(response.data.message || 'Failed to delete coupon');
        }
        toast.success(response.message);
    } catch (error) {
        console.error('Delete Coupon Error:', error);
        throw error;
    }
}