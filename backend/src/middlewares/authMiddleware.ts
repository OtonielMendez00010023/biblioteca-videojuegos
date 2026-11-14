import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Le decimos a TypeScript que nuestra petición (Request) ahora podrá llevar un usuario pegado
export interface AuthRequest extends Request {
    user?: { id: number; rol: string };
}

// 2. Guardia que verifica el Token[cite: 12]
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // El frontend enviará el token en el Header "Authorization" así: "Bearer eyJhbG..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // Desciframos el token usando nuestra clave secreta del .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; rol: string };
        
        // Le pegamos la info del usuario a la petición para usarla más adelante
        req.user = decoded; 
        
        // Le damos pase libre (continúa hacia el controlador)
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

// 3. Guardia que verifica los Roles[cite: 12]
export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
        }
        next();
    };
};