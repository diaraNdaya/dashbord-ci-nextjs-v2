export const BASE_URL = process.env.API_BASE_URL;
export const BASE_URL_DELIVERY = process.env.NEXT_PUBLIC_API_BASE_URL_DELIVERY;

export const endpoints = {
  AUTH: {
    login: () => `${BASE_URL}/auth/login`,
    logout: () => `${BASE_URL}/auth/logout`,
    me: () => `${BASE_URL}/auth/profile`,
  },
  CUSTOMER: {
    allCustomer: (
      page?: number,
      limit?: number,
      city?: string,
      name?: string,
      address?: string,
    ) => {
      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page.toString());
      if (limit !== undefined) params.append("limit", limit.toString());
      if (city && city.trim() !== "") params.append("city", city.trim());
      if (name && name.trim() !== "") params.append("name", name.trim());
      if (address && address.trim() !== "")
        params.append("address", address.trim());
      return `${BASE_URL}/customers/all?${params.toString()}`;
    },
    allCustomerBloqued: (page?: number, limit?: number) =>
      `${BASE_URL}/admins/users-blocked?page=${page}&limit=${limit}`,
    getOne: (id: string) => `${BASE_URL}/customers/${id}`,
    deleteOne: (id: string) => `${BASE_URL}/customers/${id}`,
    blockedUser: (id: string) => `${BASE_URL}/users/block/${id}`,
  },
  SELLER: {
    allSeller: (
      page?: number,
      limit?: number,
      business_address?: string,
      store_name?: string,
    ) => {
      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page.toString());
      if (limit !== undefined) params.append("limit", limit.toString());
      if (business_address && business_address.trim() !== "")
        params.append("business_address", business_address.trim());
      if (store_name && store_name.trim() !== "")
        params.append("store_name", store_name.trim());

      return `${BASE_URL}/sellers?${params.toString()}`;
    },
    topSeller: () => `${BASE_URL}/sellers/topSeller/`,
    getOneSeller: (id: string) => `${BASE_URL}/sellers/${id}`,
    sellCount: () => `${BASE_URL}/ssellers/admin`,
  },
  PRODUCT: {
    allProduct: (page?: number, limit?: number) =>
      `${BASE_URL}/products/all?page=${page}&limit=${limit}`,
    getOneProduct: (id: string) => `${BASE_URL}/products/${id}`,
    deleteOneProduct: (id: string) => `${BASE_URL}/products/${id}`,
    getProductBySeller: (id: string, page: number, limit: number) =>
      `${BASE_URL}/products/${id}/seller?page=${page}&limit=${limit}`,
  },
  ORDERS: {
    allOrders: (page?: number, limit?: number, statut?: string) => {
      let url = `${BASE_URL}/orders?page=${page}&limit=${limit}`;
      if (statut && statut !== "all") {
        url += `&statut=${statut}`;
      }
      return url;
    },
    getOneOrder: (id: string) => `${BASE_URL}/orders/${id}`,
    deleteOneOrder: (id: string) => `${BASE_URL}/orders/${id}`,
  },
  TOPCOUNT: {
    product: (page?: number, limit?: number) =>
      `${BASE_URL}/products/top?page=${page}&limit=${limit}`,
    seller: () => `${BASE_URL}/sellers/topSeller/`,
    topCategory: () => `${BASE_URL}/categories/top`,
  },
  DASHBOARD: {
    getDashboardData: () => `${BASE_URL}/admins/statistics`,
    getMetricsData: () => `${BASE_URL}/admins/metrics`,
    getSalesData: (period: string, date: string) =>
      `${BASE_URL}/admins/sales-data?period=${period}&date=${date}`,
    getProductReport: (year: number, month: number) =>
      `${BASE_URL}/admins/top-products?year=${year}&month=${month}`,
    getTopProductsByPeriod: (period: string, date: string) =>
      `${BASE_URL}/admins/top-products?period=${period}&date=${date}`,
    getUserData: (month: number, year: number) =>
      `${BASE_URL}/admins/stats-users?month=${month}&year=${year}`,
    getCategoriesData: () => `${BASE_URL}/admins/categories`,
    getTopSeller: (year: number, month: number) =>
      `${BASE_URL}/admins/top-sellers?year=${year}&month=${month}`,
    getTopSellerByPeriod: (period: string, date: string) =>
      `${BASE_URL}/admins/top-sellers?period=${period}&date=${date}`,
    getTopCategory: (year: number, month: number) =>
      `${BASE_URL}/admins/categories-sales?year=${year}&month=${month}`,
    getCommissionsSellers: (page: number, limit: number) =>
      `${BASE_URL}/admins/commission-sellers?limit=${limit}&page=${page}`,
    getCommissionGlobale: () => `${BASE_URL}/admins/commission-globale`,
    getCountCommissionSellers: () => `${BASE_URL}/admins/commission-globale`,
    createCommission: () => `${BASE_URL}/admins/commission`,
    updateCommission: () => `${BASE_URL}/admins/commission`,
    deleteCommission: (id: string) => `${BASE_URL}/admins/commission/${id}`,
    configCommission: () => `${BASE_URL}/admins/commission`,
    getCommissionEvolution: (period: string, date: string) =>
      `${BASE_URL}/admins/commission-evolution?period=${period}&date=${date}`,
    getAllDocument: (page: number, limit: number) =>
      `${BASE_URL}/admins/documents-verified?page=${page}&limit=${limit}`,
    sellersVerified: (page: number, limit: number, statut: string) =>
      `${BASE_URL}/admins/sellers-verified?limit=${limit}&page=${page}&statut=${statut}`,
    customersVerified: (page: number, limit: number, statut: string) =>
      `${BASE_URL}/admins/customers-verified?limit=${limit}&page=${page}&statut=${statut}`,
    validateDocument: (id: string) =>
      `${BASE_URL}/admins/validate-document/${id}`,
    getCommissionsSellersById: (id: string, page: number, limit: number) =>
      `${BASE_URL}/admins/commission-histories/${id}?page=${page}&limit=${limit}`,
    getUsersDeleted: (page: number, limit: number) =>
      `${BASE_URL}/admins/users-blocked?page=${page}&limit=${limit}`,
  },
  CATEGORY: {
    allCategory: (page?: number, limit?: number) =>
      `${BASE_URL}/categories/all?page=${page}&limit=${limit}`,
    createCategory: () => `${BASE_URL}/categories`,
    deleteCategorie: (id: string) => `${BASE_URL}/categories/${id}`,
    deleteSubcategory: (id: string) =>
      `${BASE_URL}/categories/sub-category/${id}`,
    updateCategory: (id: string) => `${BASE_URL}/categories/${id}`,
    updateSubCategory: (id: string) =>
      `${BASE_URL}/categories/sub-category/${id}`,
  },
  SUBCATEGORY: {
    allSubcategory: (page?: number, limit?: number) =>
      `${BASE_URL}/categories/sub-category/all?page=${page}&limit=${limit}`,
    createSubcategory: () => `${BASE_URL}/categories/sub-category`,
  },
  DATARESSORCES: {
    uploadFile: () => `${BASE_URL}/upload`,
  },
  VERSING: {
    create: `${BASE_URL}/version`,
    getAll: `${BASE_URL}/version`,
    last: `${BASE_URL}/version/one`,
    getBYId: (id: string) => `${BASE_URL}/version/${id}`,
  },
  PAYMENT: {
    allPayment: (
      period: string,
      date: string,
      page?: number,
      limit?: number,
      search?: string,
    ) =>
      `${BASE_URL}/admins/transactions?period=${period}&date=${date}&page=${page}&limit=${limit}&search=${search}`,
  },
  DELIVERY: {
    createUserDelivery: `${BASE_URL_DELIVERY}/users`,
    getAllDeliveries: (page: number, limit: number) =>
      `${BASE_URL_DELIVERY}/users?page=${page}&limit=${limit}`,
    deliveryAvailable: () => `${BASE_URL_DELIVERY}/delivery/admin/all`,
    orderDelivery: (id: string) => `${BASE_URL_DELIVERY}/delivery/admin/${id}`,
  },
  NEWLETTER: {
    getAll: (page: number, limit: number) => `${BASE_URL}/newsletter/community`,
  },
  BANNER: {
    getAll: (page: number, limit: number) =>
      `${BASE_URL}/medias/banner?page=${page}&limit=${limit}`,
    createBanner: () => `${BASE_URL}/medias/banner`,
    updateBanner: (id: string) => `${BASE_URL}/medias/banner/${id}`,
    deleteBanner: (id: string) => `${BASE_URL}/medias/banner/${id}`,
  },
};
