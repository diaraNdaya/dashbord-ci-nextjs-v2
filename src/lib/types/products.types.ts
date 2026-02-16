type ProductApi = {
  id: string;
  slug: string;
  brand?: string;
  images: string[];
  price?: { value: number; currency: "XOF" | "USD" };
  rating?: { value: number; count: number };
  sku?: string;
  name: { fr: string; en: string };
  description?: { fr?: string; en?: string };
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  colors: string[];
  fits: string[];
  sizes: string[];
  gender: string[];
  category_Id: string;
  subCategory_Id: string;
  seller_Id: string;
  reduce: number;
  tag: string;
  currency: string;
  video_url?: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  available: string;
  electronique: string[];
  dimension: string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pointure: any[];
  seller: Seller;
  categories: Categories;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AlertPrice?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AlertStock?: any;
  ProductImage: ProductImage[];
  Reviews: Review[];
}

interface Review {
  id: string;
  customer_id: string;
  product_id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  products_id: string;
}

interface Categories {
  id: string;
  name: string;
  url: string;
  images: string[];
  description: string;
  slug: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  business_address: string;
  company_logo: string;
  subscriptions: number;
  subscribes: number;
  likes: number;
  createdAt: string;
  status: boolean;
  updatedAt: string;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  totalItems: number;
  limit: number;
  totalPages: number;
  page: number;
}
export interface ProductApiResponse {
  success: boolean;
  message: string;
  product: {
    success: boolean;
    message: string;
    product: Product;
  };
}

export interface SellersApiResponse {
  success: boolean;
  message: string;
  data: Seller[];
  totalItems: number;
  limit: number;
  totalPages: number;
  page: number;
}
