export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  image: string;  // Changed from images array to single image
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  specifications: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
} 