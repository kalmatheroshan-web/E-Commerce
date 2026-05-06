import axios from "axios";

async function fetchData(url, method = "GET", body = {}, headers = {}) {
    try {
        let token = localStorage.getItem('token');
        const user = localStorage.getItem('seller-user');
        if (user) token = null;

        const response = await axios({
            url: String(url).toLowerCase(),
            method,
            data: body,
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : ""
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export default fetchData;