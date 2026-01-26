export interface Restaurant {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  restaurant: Restaurant;
  category: Category;
  price: number;
  image: string;
  soldCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodResponse {
  success: boolean;
  data: Food[];
}
