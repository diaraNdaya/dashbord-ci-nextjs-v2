export const BASE_URL = process.env.API_BASE_URL;
export const paymentApiEndpoints = process.env.PAYMENT_API;
export const endpoints = {
  USER: {
    OTP: {
      verify: `${BASE_URL}/otp/verify`, // Ok
      create: `${BASE_URL}/otp/create`, // ok
      reload: `${BASE_URL}/otp/resend`, // ok
    },
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/users?lang=fr`, // ok
    PROFILE: `${BASE_URL}/auth/profile`, // ok
    UPDATE: (id: string) => `${BASE_URL}/users/${id}`, // ok
    CHANGE_ROLE: `${BASE_URL}/users/passage`, // ok
    ADDRESS: {
      create: `${BASE_URL}/address`, // probleme de cors
      update: (id: string) => `${BASE_URL}/address/${id}`, // probleme de cors
      delete: (id: string) => `${BASE_URL}/address/${id}`, // probleme de cors
      getAddress: `${BASE_URL}/address/customer`,
    },
    RESET: {
      updatePassword: `${BASE_URL}/users/reset-password`, // ok
      forgotPassword: `${BASE_URL}/forgot`, // ok
      verifyOTP: `${BASE_URL}/forgot/verify`, // ok
      index: (id: string) => `${BASE_URL}/forgot/${id}`, // ok
    },
  },
  SUBCATEGORIES: {
    subcategoryByCategory: (categoryId: string, page?: number, limit?: number) =>
      `${BASE_URL}/categories/sub-category/all/${categoryId}?page=${page}&limit=${limit}`, // ok
    allSubcategory: (page?: number, limit?: number) =>
      `${BASE_URL}/categories/sub-category/all?page=${page}&limit=${limit}`, // ok
  },
  CATEGORIES: {
    subcategoryByCategory: (categoryId: string, page?: number, limit?: number) =>
      `${BASE_URL}/categories/sub-category/all/${categoryId}?page=${page}&limit=${limit}`,
    allCategory: (page?: number, limit?: number) =>
      `${BASE_URL}/categories/all?page=${page}&limit=${limit}`, // ok
    topCategory : () =>`${BASE_URL}/categories/top`,
    trendingCategory : () =>`${BASE_URL}/categories/trending`
  },
  ORDERS: {
    create: `${BASE_URL}/orders`,
    update: (id: string) => `${BASE_URL}/orders/${id}`,
    getOrder: (id: string) => `${BASE_URL}/orders/${id}`,
    allOrders: (page?: number, limit?: number, statut?: string): string => {
      let url = `${BASE_URL}/orders/customer?page=${page}&limit=${limit}`;
      if (statut && statut !== "all") {
        url += `&statut=${statut}`;
      }
      return url;
    },
    order: (orderId: string) => `${BASE_URL}/orders/${orderId}`,
  },
  PRODUCTS: {
    allProduct: (page?: number, limit?: number) =>
      `${BASE_URL}/products/all?limit=${limit}&page=${page}`, // ok
    productById: (id: string) => `${BASE_URL}/products/${id}`, // ok
    productsByCategory: (categoryId: string, page?: number, limit?: number) =>
      `${BASE_URL}/categories/all/${categoryId}/products?page=${page}&limit=${limit}`, // ok
    productsBySubCategory: (
      subCategoryId: string,
      page?: number,
      limit?: number
    ) =>
      `${BASE_URL}/categories/sub-category/${subCategoryId}/products?page=${page}&limit=${limit}`, // ok
    topProducts: (page?: number, limit?: number) =>
      `${BASE_URL}/products/top?page=${page}&limit=${limit}`, // ok
    filterProducts: (filters: string, page?: number, limit?: number) =>
      `${BASE_URL}/products/filter-web?${filters}&page=${page}&limit=${limit}`, // ok
    ProductsByOrder: (page: number, limit: number) =>
      `${BASE_URL}/products/top-order?limit=${limit}&page=${page}`, // ok
    discountProducts: (page: number, limit: number) =>
      `${BASE_URL}/products/top-discounts?limit=${limit}&page=${page}`, // ok
  },
  REVIEWS: {
    create: `${BASE_URL}/reviews`, // ok
    byProduct: (productId: string, page: number, limit: number) =>
      `${BASE_URL}/reviews/${productId}/products?limit=${limit}&page=${page}`, // ok
    byId: (ReviewId: string) => `${BASE_URL}/reviews/${ReviewId}`,
  },
  WISHLIST: {
    allWishlist: `${BASE_URL}/wishlists/customer`,
    addToWishlist: `${BASE_URL}/wishlists`,
    removeFromWishlist: (productId: string) =>
      `${BASE_URL}/wishlists/${productId}`,
    deleteWishlist: (wishlistId: string) =>
      `${BASE_URL}/wishlists/${wishlistId}`,
    getWishlist: (wishlistId: string) => `${BASE_URL}/wishlists/${wishlistId}`,
  },
  CARTS: {
    allCarts: (customerId: string) =>
      `${BASE_URL}/carts/customer/${customerId}`,
    deleteCart: (cartId: string) => `${BASE_URL}/carts/${cartId}`,
    updateCart: (cartId: string) => `${BASE_URL}/carts/${cartId}`,
    createCart: `${BASE_URL}/carts`,
  },
  PAYMENTS: {
    card: `${BASE_URL}/payments/stripeWeb-payment`,
    getPayment: `${BASE_URL}/payments/card`,
    deletePayment: `${BASE_URL}/payments/card`,
    verify: (orders_id: string) =>
      `${BASE_URL}/payments/verify-payment/${orders_id}`,
    verifyMobilePayment: (orders_id: string) =>
      `${BASE_URL}/verify-payment/${orders_id}`,
    mobileMoney: `${BASE_URL}/payments/init-payment`,
    // mobileMoney: `${paymentApiEndpoints}/payments`,
  },
  SHIPPING: {
    getShipping: `${BASE_URL}/shipping-methods`,
  },
  NOTIFICATIONS: {
    getNotifications: (userId: string, page: number, limit: number) =>
      `${BASE_URL}/notifications/user/${userId}?page=${page}&limit=${limit}`,
  },
  NEWSLETTER: {
    subscribe: `${BASE_URL}/newsletter`,
  },
};
