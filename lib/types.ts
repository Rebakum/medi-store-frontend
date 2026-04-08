export type MedicineForm = "TABLET" | "CAPSULE" | "SYRUP" | "INJECTION" | "OINTMENT" | "DROPS";
export type MedicineStatus = "ACTIVE" | "OUT_OF_STOCK" | "DISABLED";
export type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type Role = "CUSTOMER" | "SELLER" | "ADMIN";
export type ApiResponse<T> = { success: boolean; message: string; data: T }






export type MyReview = {
  id: string;
  medicineId: string;
};

export type OrderUpdatedPayload = {
  orderId: string;
  status: OrderStatus;
  total?: number;
  updatedAt?: string;
};


export type OrderItem = {
  id: string;
  medicineId: string;
  quantity: number;
  price: number;
  sellerId: string;
  medicine?: {
    id: string;
    name: string;
    images?: string[];
  };
};

export type Order = {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  address: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: { id: string; name?: string; email: string };
};
export type Category = {
  id: string;
  name: string;
  image?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};


export type Medicine = {
  id: string;
  name: string;
  brand: string;

  brandLogo?: string | null; 

  form: MedicineForm;
  price: number;
  stock: number;
  description: string;
  manufacturer: string;
  images: string[];
  status: MedicineStatus;
  sellerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  seller?: { id: string; name?: string | null; email: string };
};
export type Brand = {
  brand: string;
  brandLogo?: string | null;
};

export type Meta = { page: number; limit: number; total: number; totalPage?: number };

export type ApiList<T> = {
  success?: boolean;
  message?: string;
  data: T;         
  meta?: Meta;
};

export type ApiOne<T> = { data: T };

export type Paginated<T> = {
  data: T[];
  meta?: { page: number; limit: number; total: number; totalPage?: number };
};


export type MeUser = {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  sellerLogo?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type User = {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  isActive: boolean;
  avatar?: string | null;
  createdAt: string;
};


export const statusColor: Record<OrderStatus, string> = {
  PLACED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
};
export const statusStyle: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
  DISABLED: "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200",
  OUT_OF_STOCK: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
};
export type AdminStats = {
  users: { total: number; new7d: number };
  orders: { today: number; pending: number; processing: number };
  medicines: { active: number; lowStock: number; lowStockThreshold: number };
  revenue: { today: number; thisMonth: number; changePct: number };
};



export type SellerStats = {
  medicines: { active: number; lowStock: number; lowStockThreshold: number };
  orders: { today: number; pending: number; processing: number };

  // NEW
  revenue?: { today: number; month: number };

  recentOrders: Array<{
    id: string;
    status:
      | "PLACED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
      | string;
    total: number;
    createdAt: string;
    customer?: { id: string; name?: string | null; email: string } | null;
  }>;

  // NEW
  recentReviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    medicine: {
      id: string;
      name: string;
      images?: string[] | null;
      image?: string | null;
    };
    customer: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatar?: string | null;
      avatarUrl?: string | null;
    };
  }>;

  lowStockMedicines: Array<{
    id: string;
    name: string;
    stock: number;
    status?: string;
    price?: number;
    createdAt?: string;
  }>;
};

