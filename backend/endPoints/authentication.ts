
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/models';

interface Requests{
  headers:any
  user?  :{
    id:number
    role?:UserRole
  }
}

export const authenticateUser = async (req: Requests, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized - Missing token' });
  }

  try {
    const decodedToken: any = jwt.verify(token, '#!_c@rT!fY_m3mB3Rs');
    req.user = { id: decodedToken.userId,  role: decodedToken.role  };
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req.user as { id: number; role: UserRole }).role;

  if (userRole !== UserRole.ADMIN) {
    return res.status(403).json({ success: false, message: 'Forbidden - Admin access required' });
  }

  next();
};
