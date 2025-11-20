/**
 * 环境变量配置
 */

// 客户端环境变量（以 NEXT_PUBLIC_ 开头）
export const clientEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  environment: process.env.NODE_ENV || 'development',
} as const;

// 服务端环境变量（仅在服务端可用）
export const serverEnv = {
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  // 服务端API配置
  backendApiUrl: process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  // 其他服务端专用环境变量
} as const;

// 验证必需的环境变量
export function validateEnv() {
  const requiredClientEnv = ['NEXT_PUBLIC_SITE_URL'] as const;
  const requiredServerEnv = ['CLERK_SECRET_KEY'] as const;

  const missingEnv: string[] = [];

  // 检查客户端环境变量
  requiredClientEnv.forEach(key => {
    if (!process.env[key]) {
      missingEnv.push(key);
    }
  });

  // 检查服务端环境变量（仅在服务端）
  if (typeof window === 'undefined') {
    requiredServerEnv.forEach(key => {
      if (!process.env[key]) {
        missingEnv.push(key);
      }
    });
  }

  if (missingEnv.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  }
}

export const isDevelopment = clientEnv.environment === 'development';
export const isProduction = clientEnv.environment === 'production';
export const isTest = clientEnv.environment === 'test';
