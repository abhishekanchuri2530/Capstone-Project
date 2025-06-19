import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Define context type
interface MyContext {
  user: { id: string } | null;
}

// Define JWT payload type
interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Connect to MongoDB with retries
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    if (retries > 0) {
      console.log(`❌ MongoDB connection failed. Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('❌ Could not connect to MongoDB. Please ensure MongoDB is installed and running.');
      process.exit(1);
    }
  }
};

// Context function to handle authentication
const getUser = (token: string): { id: string } | null => {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    return { id: decoded.id };
  } catch (error) {
    return null;
  }
};

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  try {
    await connectDB();
    const { url } = await startStandaloneServer(
      server,
      {
        context: async ({ req }) => {
          const token = req.headers.authorization || '';
          const user = getUser(token.replace('Bearer ', ''));
          return { user };
        },
        listen: { port: PORT },
      }
    );
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();