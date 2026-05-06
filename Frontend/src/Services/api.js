const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const auth = {
    VERIFY_API: BASE_URL + '/auth/verify',
    SENDOTP_API: BASE_URL + '/auth/sendOtp',
    SIGNUP_API: BASE_URL + '/auth/signUp',
    LOGIN_API: BASE_URL + '/auth/login',
    CART_API: BASE_URL + '/auth/add/:id',
    REMOVECART_API: BASE_URL + '/auth/remove/:id',
    VIEWCART_API: BASE_URL + '/auth/get',
    UPDATECART_API: BASE_URL + '/aut/update/:id/:mark',
    COUPON_API: BASE_URL + '/auth/coupon',
    CHANGE_PASSWORD_API: BASE_URL + '/auth/changePassword',
    ADD_API: BASE_URL + "/auth/add",
    VIEW_API: BASE_URL + "/auth/get",
    DESCREASE_API: BASE_URL + '/auth/decrease',
    REMOVE_API: BASE_URL + '/auth/remove',
    CREATE_ORDER_API: BASE_URL + '/auth/create-order',
    VERIFY_PAYMENT: BASE_URL + '/auth/verify-payment',
    PLACE_ORDER: BASE_URL + '/auth/place-order',
    VIEW_ORDER: BASE_URL + '/auth/view-order',
    UPDATE_STATUS_API: BASE_URL + '/auth/update-status',
    EDIT_ADDRESS_API:BASE_URL + '/auth/edit-address',
}

export const product = {
    CREATE_API: BASE_URL + '/product/create',
    UPDATE_API: BASE_URL + '/product/update/:productId',
    DELETE_API: BASE_URL + '/product/delete/:productId',
    GET_ALLPRODUCT_API: BASE_URL + '/product/getAllProducts',
    GET_ALL_SELLER_PRODUCT_API: BASE_URL + '/product/getAllSellerProducts',
    GET_ALLORDERS: BASE_URL + '/product/getAllOrders',
    GET_PRODUCT_API: BASE_URL + '/product/getCategory/:catId',
    CREATE_REVIEW_API: BASE_URL + '/product/create/Review',
    GET_REVIEW_API: BASE_URL + '/product/getReview',
}

export const category = {
    READ_API: BASE_URL + "/category/read",
    CREATE_CAT_API: BASE_URL + "/category/create",
    DELETE_CAT_API: BASE_URL + "/category/delete",
    VIEW_COUPONS_API: BASE_URL + "/category/view-coupons",
    CREATE_COUPONS_API: BASE_URL + "/category/create-coupons",
    DELETE_COUPONS_API: BASE_URL + "/category/delete-coupons",
}


export const search = {
    SEARCH_RESULT: BASE_URL + '/search/searchResult'
}


