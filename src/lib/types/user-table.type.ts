export type UserTableCategory = "customers" | "sellers";

export interface UserTableRow {
  id: string;
  profileId: string;
  category: UserTableCategory;
  displayName: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  createdAt: string;
  isVerified: boolean;
  isBlocked: boolean;
  avatar?: string | null;
}
