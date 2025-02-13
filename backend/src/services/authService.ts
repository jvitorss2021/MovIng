import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterData {
  username: string;
  name: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

export class AuthService {
  async register({ username, name, password }: RegisterData) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        username, 
        name, 
        password: hashedPassword 
      },
      select: {
        id: true,
        username: true,
        name: true
      }
    });
    
    return user;
  }

  async login({ username, password }: LoginData) {
    const user = await prisma.user.findUnique({ 
      where: { username } 
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    return { 
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    };
  }
} 