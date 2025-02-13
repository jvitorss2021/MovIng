import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, name, password } = req.body;
      
      if (!username || !name || !password) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        });
      }

      const user = await authService.register({ username, name, password });
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          error: 'Username e senha são obrigatórios' 
        });
      }

      const result = await authService.login({ username, password });
      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }
} 