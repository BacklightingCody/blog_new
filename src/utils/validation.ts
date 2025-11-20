/**
 * 数据验证工具函数
 */

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证手机号格式（中国大陆）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('密码长度至少 8 位');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('需包含小写字母');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('需包含大写字母');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('需包含数字');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('需包含特殊字符');
  } else {
    score += 1;
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 2) strength = 'medium';

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * 清理和验证用户输入
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // 移除可能的 HTML 标签
    .replace(/javascript:/gi, '') // 移除潜在的 XSS
    .slice(0, 1000); // 限制长度
}
