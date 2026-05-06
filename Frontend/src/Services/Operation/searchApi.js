import { toast } from "sonner";
import fetchData from "../../hooks/fetchData";
import { search } from "../api";

const { SEARCH_RESULT } = search;

export async function searchResult(value) {
    try {
        const response = await fetchData(SEARCH_RESULT, 'POST', { search: value });
        if (response.success) {
            return response.products;
        }
    } catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
}