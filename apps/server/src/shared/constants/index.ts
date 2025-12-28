export const MALICIOUS_PATTERNS = [
  /(<script|<\/script|javascript:|on\w+\s*=)/i, // XSS patterns
  /(union\s+select|drop\s+table|insert\s+into|delete\s+from|alter\s+table)/i, // SQL injection
  /(exec|execute|sp_|xp_)/i, // Stored procedure calls
  /(\bor\b|\band\b).*[=<>].*['"]/i, // SQL boolean injection
  /(--|\/\*|\*\/|;|'|")/i // Common injection characters
];
