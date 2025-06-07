export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: Category;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  isFeatured?: boolean;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  countInStock: number;
  quantity: number;
} 