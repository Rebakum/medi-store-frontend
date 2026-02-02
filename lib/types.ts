export type MedicineForm = "TABLET" | "CAPSULE" | "SYRUP" | "INJECTION" | "OINTMENT" | "DROPS";
export type MedicineStatus = "ACTIVE" | "OUT_OF_STOCK" | "DISABLED";

export type Category = {
  id: string;
  name: string;
  image?: string | null;
  isActive: boolean;
};

export type Medicine = {
  id: string;
  name: string;
  brand: string;
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

  // backend include করলে আসতে পারে
  category?: Category;
  seller?: { id: string; name?: string | null; email: string };
};

export type ApiList<T> = { data: T[]; meta?: any };
export type ApiOne<T> = { data: T };

export type Paginated<T> = {
  data: T[];
  meta?: { page: number; limit: number; total: number; totalPage?: number };
};
