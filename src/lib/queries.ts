import { gql } from '@apollo/client';

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    products(limit: 3) {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($category: ID, $search: String) {
    products(category: $category, search: $search) {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
        description
      }
      reviews {
        _id
        rating
        comment
        created_at
        user {
          _id
          name
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      name
      email
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;