# Security Setup Guide

## Overview

This guide walks you through setting up secure configurations for the YYC³ Catering Platform.

## Required Environment Variables

### 1. Generate JWT Secret

Generate a cryptographically secure JWT secret:

```bash
# Linux/macOS
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to your `.env` file:
```bash
JWT_SECRET=<generated-secret-here>
JWT_EXPIRES_IN=24h
```

**Important**: The JWT_SECRET must be at least 32 characters long. The application will refuse to start if this requirement is not met.

### 2. Configure CORS Origins

Never use wildcard (`*`) for CORS in production. List all allowed origins:

```bash
# Development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Production
CORS_ORIGIN=https://app.yourdomain.com,https://admin.yourdomain.com
```

### 3. Database Configuration

Use strong, unique passwords for database access:

```bash
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=yyc3_production
DATABASE_USER=yyc3_user
DATABASE_PASSWORD=<strong-unique-password>
DATABASE_SSL=true  # Always enable SSL in production
```

### 4. Redis Configuration

Secure your Redis instance:

```bash
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>
REDIS_DB=0
```

### 5. External Service Credentials

Secure all third-party API credentials:

```bash
# Email Service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=<app-specific-password>

# WeChat (if applicable)
WECHAT_APP_ID=<your-app-id>
WECHAT_APP_SECRET=<your-app-secret>

# Aliyun (if applicable)
ALIYUN_ACCESS_KEY=<your-access-key>
ALIYUN_SECRET_KEY=<your-secret-key>
```

## Security Checklist

### Before Deployment

- [ ] All secrets removed from code
- [ ] JWT_SECRET set and >= 32 characters
- [ ] CORS origins explicitly configured (no wildcards)
- [ ] Database uses strong password
- [ ] Redis password configured
- [ ] SSL/TLS enabled for database and Redis
- [ ] All environment variables set in production
- [ ] `.env` file added to `.gitignore`
- [ ] Helmet middleware enabled (default)
- [ ] Rate limiting configured (default)
- [ ] HTTPS enforced in production

### Regular Maintenance

- [ ] Run `npm audit` weekly
- [ ] Update dependencies monthly
- [ ] Review access logs regularly
- [ ] Rotate secrets quarterly
- [ ] Backup database daily
- [ ] Test disaster recovery plan
- [ ] Review user access permissions

## Common Security Issues

### Issue: JWT_SECRET Not Set

**Error**: `JWT_SECRET environment variable must be set with at least 32 characters`

**Solution**: Generate and set a secure JWT_SECRET as shown above.

### Issue: CORS Errors in Production

**Error**: CORS policy blocking requests

**Solution**: Add your frontend domain to CORS_ORIGIN:
```bash
CORS_ORIGIN=https://your-frontend-domain.com
```

### Issue: Database Connection Failed

**Error**: SSL required but not configured

**Solution**: Enable SSL in database configuration:
```bash
DATABASE_SSL=true
```

## Testing Security

### 1. Test Authentication

```bash
# Generate test token (requires JWT_SECRET to be set)
JWT_SECRET=your-secret node backend/services/ai-assistant/generate-token.js
```

### 2. Run Security Audit

```bash
# Check for dependency vulnerabilities
npm audit

# Fix automatically (non-breaking changes)
npm audit fix

# Fix including breaking changes (review carefully)
npm audit fix --force
```

### 3. Run CodeQL Scan

```bash
# If you have CodeQL CLI installed
codeql database create db --language=javascript
codeql database analyze db --format=sarif-latest --output=results.sarif
```

## Security Monitoring

### Log Monitoring

Monitor these logs for security issues:

- Authentication failures (3+ in 5 minutes = potential attack)
- Rate limit violations
- Unusual access patterns
- Database query errors
- File upload attempts with invalid formats

### Alerting

Set up alerts for:

- Multiple failed login attempts
- Unusual traffic patterns
- Database connection failures
- High error rates
- Suspicious user activity

## Incident Response

### If You Suspect a Security Breach

1. **Immediate Actions**:
   - Disable compromised accounts
   - Rotate all secrets immediately
   - Review access logs
   - Check for unauthorized changes

2. **Investigation**:
   - Determine scope of breach
   - Identify compromised data
   - Document timeline of events

3. **Recovery**:
   - Apply security patches
   - Restore from clean backups if needed
   - Update credentials
   - Notify affected users (if required)

4. **Prevention**:
   - Review and improve security measures
   - Update security documentation
   - Train team on new procedures

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## Support

For security questions or to report vulnerabilities:
- Email: security@yyc3.red
- For general support: dev@yyc3.red
