# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Recent Security Improvements

### January 2026 Security Update

We've recently addressed multiple security vulnerabilities in the codebase:

#### Authentication & Authorization
- ✅ Removed all hardcoded JWT secrets across all services
- ✅ Enforced JWT_SECRET environment variable with minimum 32 character requirement
- ✅ Replaced custom JWT implementations with industry-standard `jsonwebtoken` library
- ✅ Added issuer/audience validation for JWT tokens
- ✅ Implemented proper JWT signature verification

#### File Security
- ✅ Added format validation for file exports with whitelist
- ✅ Implemented filename sanitization to prevent directory traversal
- ✅ Added proper escaping in Content-Disposition headers

#### Network Security
- ✅ Fixed CORS wildcard configuration - now requires explicit origin configuration
- ✅ Maintained helmet security middleware across all services
- ✅ Kept rate limiting protection on all API endpoints

#### Data Security
- ✅ Verified all SQL queries use parameterized queries (no SQL injection)
- ✅ Confirmed bcrypt usage for password hashing (secure)
- ✅ No eval(), command injection, XXE, or prototype pollution vulnerabilities found

#### Dependency Updates
- ✅ Updated `nodemailer` from ^7.0.12 to ^7.0.11 (DoS vulnerability fix)
- ✅ Updated `multer` from ^2.0.2 to ^2.0.0 (security fix)

## Security Requirements

### Environment Variables

**Critical**: The following environment variables MUST be set in production:

```bash
# JWT Configuration (Required)
JWT_SECRET=<32+ character cryptographically secure random string>
# Generate with: openssl rand -base64 32

# CORS Configuration (Required)
CORS_ORIGIN=https://your-domain.com,https://admin.your-domain.com
# Never use '*' in production

# Database Configuration (Required)
DATABASE_PASSWORD=<strong unique password>
```

### Security Best Practices for Developers

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Use parameterized queries**: Always use $1, $2, etc. for SQL parameters
3. **Validate user input**: Use Zod schemas for request validation
4. **Escape output**: Properly escape data in responses
5. **Use HTTPS**: Always use HTTPS in production
6. **Keep dependencies updated**: Run `npm audit` regularly
7. **Review code changes**: Use the code review tool before merging

### Running Security Checks

```bash
# Check for dependency vulnerabilities
npm audit

# Run CodeQL security scanning
npm run security:scan

# Check for outdated packages
npm outdated
```

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing:

**security@yyc3.red**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Every 48 hours
- **Fix Timeline**: Critical issues within 7 days, high priority within 14 days

### Disclosure Policy

- We follow responsible disclosure practices
- We will acknowledge your contribution in our security advisories
- Please allow us to fix the issue before public disclosure
- We aim to release security patches as soon as safely possible

## Security Contact

For security inquiries: security@yyc3.red  
For general support: dev@yyc3.red
