import { ApiResponse } from "@/services/api.type";

export enum ShippingMethod {
  standard_delivery = "STANDARD_DELIVERY",
  express_delivery = "EXPRESS_DELIVERY",
  pickup_point = "PICKUP_POINT",
  scheduled_delivery = "SCHEDULED_DELIVERY",
}

export const shippingCosts: Record<ShippingMethod, number> = {
  [ShippingMethod.standard_delivery]: 10,
  [ShippingMethod.express_delivery]: 25,
  [ShippingMethod.pickup_point]: 5,
  [ShippingMethod.scheduled_delivery]: 30,
};

export const getShippingMethodLabel = (method: ShippingMethod): string => {
  const labels = {
    [ShippingMethod.standard_delivery]: "Livraison standard",
    [ShippingMethod.express_delivery]: "Livraison express",
    [ShippingMethod.pickup_point]: "Point relais",
    [ShippingMethod.scheduled_delivery]: "Livraison programmée",
  };
  return labels[method];
};

export interface Order {
  id: string;
  customer_Id: string;
  orderDate: string;
  statut:
    | "pending"
    | "confirmed"
    | "progress"
    | "courier_contacted"
    | "packing"
    | "delivered"
    | "cancel";
  payment_Id: string;
  ShippingMethod: ShippingMethod;
  quantity: number;
  totalAmount: number;
  address_id: string;
  email: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userId?: any;
  shippingMethods?: {
    id: string;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
  };
  orderItem: OrderItem[];
  customer: Customer;
  payment: Payment;
}

interface Payment {
  id: string;
  orders_id: string;
  customer_id: string;
  payment_method: string;
  provider?: string;
  operator: string;
  amount: number;
  payment_status: "paid" | "pending" | "failed";
  currency: string;
  payment_date: string;
  paymentStripeId: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  user_id: string;
  address: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

export interface OrderItem {
  id: string;
  order_Id: string;
  quantity: number;
  seller_id: string;
  price: number;
  subProductId: string;
  product_Id: string;
  color: string;
  size: string;
  gender: string;
  fit: string;
  dimension: string;
  pointure: string;
  electronique: string;
  statut: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  colors: string[];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  fits: any[];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  sizes: any[];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  gender: any[];
  category_Id: string;
  subCategory_Id: string;
  seller_Id: string;
  reduce: number;
  tag: string;
  currency: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  video_url?: any;
  condition: string;
  createdAt: string;
  updatedAt: string;
  available: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  electronique: any[];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimension: any[];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  pointure: any[];
  ProductImage: ProductImage[];
  seller: Seller;
}

interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  business_address: string;
  company_logo: string;
  subscriptions: number;
  subscribes: number;
  likes: number;
  isVerified: boolean;
  createdAt: string;
  status: boolean;
  cover_url: string;
  updatedAt: string;
}

interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  products_id: string;
  createdAt: string;
  updatedAt: string;
}

export enum paymentMethod {
  card = "card",
  mobile_money = "mobile_money",
  cash = "cash",
}

export interface ProductItem {
  product_id: string;
  quantity: number;
  color: string;
  size: string;
  device: string;
  gender: string;
  dimension: string;
  fit: string;
  pointure: string;
  electronique: string;
}

export type OrderDetails = {
  id: string;
  number?: string;
  status?: string;
  totalAmount?: number;
  currency?: string;
  items?: Array<{
    name?: string;
    quantity: number;
    unitPrice?: number;
    total?: number;
    imageUrl?: string;
  }>;
  shipping?: {
    method?: string;
    price?: number;
    address?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      line1?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    etaDays?: number;
  };
  payment?: {
    method?: string;
    provider?: string;
    status?: string;
    amount?: number;
    currency?: string;
    transactionId?: string;
    paidAt?: string;
  };
};

export interface OrdersApiResponse extends ApiResponse<Order[]> {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}
