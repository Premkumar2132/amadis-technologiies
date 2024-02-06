import express from 'express';
import users from './endPoints/user';
import productsRoute from './endPoints/products';
import jwt from 'jsonwebtoken'; // Import jwt module
import cartRoutes from './endPoints/cart';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { log } from 'console';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role?: any };
    }
  }
}

const app = express();
app.use(express.json());
app.use(cookieParser()); 

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    res.cookie('token', token, { httpOnly: true });
  }
  next();
});

app.use((req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  
  if (token) {
    try {
      const decodedToken: any = jwt.verify(token, 'hicartify'); 
      req.user = { id: decodedToken.userId, role: decodedToken.role };
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  }
  next();
});

const allowedOrigins = ['http://localhost:5173'];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

app.use('/api/users', users);
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
