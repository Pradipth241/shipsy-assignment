// src/lib/auth.ts
import jwt from 'jsonwebtoken';

export function getUserIdFromToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, "261926") as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
}