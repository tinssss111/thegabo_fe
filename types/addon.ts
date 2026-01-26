export interface Addon {
  _id: string;
  food?: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
  addonName: string;
  price: number;
  stock: number | null;
  isAvailable: boolean;
}

export interface AddonResponse {
  success: boolean;
  data:
  | Addon[]
  | {
    items: Addon[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
