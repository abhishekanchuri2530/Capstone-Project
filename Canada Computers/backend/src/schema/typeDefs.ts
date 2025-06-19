export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    email: String!
    orders: [Order]
    cart: Cart
    reviews: [Review]
    notifications: [Notification]
  }

  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    category: Category!
    image_url: String
    stock: Int!
    reviews: [Review]
    averageRating: Float
  }

  type Category {
    _id: ID!
    name: String!
    description: String
    products: [Product]
  }

  type Order {
    _id: ID!
    user: User!
    order_date: String!
    total: Float!
    status: String!
    items: [OrderItem]!
    shipping_address: Address
  }

  type OrderItem {
    _id: ID!
    product: Product!
    quantity: Int!
    price_at_time: Float!
  }

  type Cart {
    _id: ID!
    user: User!
    items: [CartItem]!
  }

  type CartItem {
    _id: ID!
    product: Product!
    quantity: Int!
  }

  type Address {
    street: String!
    city: String!
    state: String!
    postal_code: String!
    country: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    postal_code: String!
    country: String!
  }

  type Review {
    _id: ID!
    product: Product!
    user: User!
    rating: Int!
    comment: String!
    created_at: String!
  }

  type Notification {
    _id: ID!
    user: User!
    message: String!
    type: NotificationType!
    is_read: Boolean!
    created_at: String!
  }

  enum NotificationType {
    order_status
    product_restock
    price_drop
    general
  }

  type Query {
    me: User
    product(id: ID!): Product
    products(category: ID, search: String, limit: Int): [Product]
    categories: [Category]
    cart: Cart
    order(id: ID!): Order
    orders: [Order]
    productReviews(productId: ID!): [Review]
    userReviews(userId: ID!): [Review]
    notifications: [Notification]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addToCart(productId: ID!, quantity: Int!): Cart
    updateCartItem(productId: ID!, quantity: Int!): Cart
    removeFromCart(productId: ID!): Cart
    createOrder(address: AddressInput!): Order
    updateOrderStatus(orderId: ID!, status: String!): Order
    createReview(productId: ID!, rating: Int!, comment: String!): Review
    updateReview(reviewId: ID!, rating: Int!, comment: String!): Review
    deleteReview(reviewId: ID!): Boolean
    markNotificationRead(notificationId: ID!): Notification
    markAllNotificationsRead: [Notification]
  }
`;