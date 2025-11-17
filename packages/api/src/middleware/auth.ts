import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to verify API key for admin endpoints
 * Protects sensitive operations like approving updates and triggering refreshes
 */
export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.ADMIN_API_KEY;

  // In development, allow requests without API key if ADMIN_API_KEY is not set
  if (!validApiKey && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  WARNING: ADMIN_API_KEY not set. All admin endpoints are unprotected!');
    return next();
  }

  // In production, API key is required
  if (!validApiKey) {
    console.error('❌ ADMIN_API_KEY not configured. Admin endpoints are disabled.');
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Admin API key not configured'
    });
  }

  // Verify API key
  if (!apiKey || apiKey !== validApiKey) {
    console.warn(`⚠️  Unauthorized access attempt to ${req.method} ${req.path}`);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required. Include x-api-key header.'
    });
  }

  // API key is valid
  next();
}

/**
 * Middleware to log authenticated requests
 */
export function logAuthenticatedRequest(req: Request, res: Response, next: NextFunction) {
  console.log(`✓ Authenticated ${req.method} ${req.path}`);
  next();
}
