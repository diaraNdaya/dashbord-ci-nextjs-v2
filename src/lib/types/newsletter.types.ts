export interface Newsletter {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterApiResponse {
  success: boolean;
  message: string;
  data: Newsletter[];
  totalItems?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
}
