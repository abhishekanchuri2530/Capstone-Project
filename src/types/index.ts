export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image_url: string;
  stock: number;
  averageRating?: number;
  reviews?: Review[];
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Review {
  _id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  created_at?: string;
}

export interface ProductsData {
  products: Product[];
}

export interface ProductData {
  product: Product;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: User;
  items: CartItem[];
}