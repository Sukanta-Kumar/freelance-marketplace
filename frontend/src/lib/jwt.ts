import { Role } from '@/types/enums';

export interface DecodedJwt {
  sub: string;
  role: Role;
  exp?: number;
  iat?: number;
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const parsed = JSON.parse(jsonPayload);
    if (!parsed || !parsed.sub || !parsed.role) {
      return null;
    }
    
    return {
      sub: String(parsed.sub),
      role: parsed.role as Role,
      exp: parsed.exp,
      iat: parsed.iat,
    };
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return false;
  return decoded.exp * 1000 < Date.now();
}
