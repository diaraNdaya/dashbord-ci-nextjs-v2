import { ApiResponse } from "@/services/api.type";

export enum StatusOrder {
  courier_contacted = "courier_contacted",
  pending = "pending",
  confirmed = "confirmed",
  progress = "progress",
  packing = "packing",
  delivered = "delivered",
  cancel = "cancel",
}

export interface Purchase {
  id: string;
  seller_id: string;
  quantity: number;
  totalPrice: number;
  statut: StatusOrder;
  customer_id: string;
  currency: string;
  createdAt: string;
  deliveredAt: string | null;
  withdrawableAt: string | null;
  addedToWithdrawable: boolean;
  shippingMethod: string;
  shippingMethodId: string;
  method: string;
  updatedAt: string;
  ordersId: string;
  totalAmount: number;
  Orders: {
    orderItem: OrderItem[];
  };
  orderItem: OrderItem[];
  payment: Payment;
  shippingMethods: ShippingMethods;
  customer: Customer;
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
  statut: StatusOrder;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

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
  descriptionNormalized: string;
  nameNormalized: string;
  currency: string;
  isPublished: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  video_url: string | null;
  randKey: number;
  condition: string;
  createdAt: string;
  updatedAt: string;
  available: string;
  electronique: string[];
  dimension: string[];
  pointure: string[];
  ProductImage: ProductImage[];
  Reviews: Review[];
  seller: Seller;
  categories: Category;
  AlertPrice: unknown;
  AlertStock: unknown;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  products_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
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
  isVerified: boolean;
  createdAt: string;
  withdrawableBalance: number;
  status: boolean;
  cover_url: string;
  updatedAt: string;
  is_ADV: string;
}

export interface Category {
  id: string;
  name: string;
  url: string;
  images: string[];
  description: string;
  descriptionNormalized: string;
  nameNormalized: string;
  slug: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orders_id: string;
  customer_id: string;
  payment_method: string;
  amount: number;
  payment_status: string;
  provider: string;
  currency: string;
  payment_date: string;
  paymentStripeId: string;
  stripeCustomerId: string;
  paidAt: string | null;
  phonePaid: string;
  paymentIntentId: string;
  failureReason: string;
  createdAt: string;
  reference: string;
  operator: string;
  transactionId: string;
  updatedAt: string;
}

export interface ShippingMethods {
  id: string;
  name: string;
  price: number;
  active: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  user_id: string;
  address: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  city: string;
  country: string;
  dateOfBirth: string;
  is_active: boolean;
  isVendor: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  provider: string;
  socialId: string | null;
  password_hash: string;
  clientStripeId: string;
  status: boolean;
  role_Id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchasesApiResponse extends ApiResponse<Purchase[]> {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface UpdatePurchaseStatusPayload {
  statut: StatusOrder;
}
