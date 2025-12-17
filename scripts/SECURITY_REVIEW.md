# Security Review - Machina Frontend Boilerplate

## ✅ Security Best Practices Implemented

### 1. API Keys Protection

- ✅ All API routes use server-side environment variables (`process.env.MACHINA_API_KEY`, `process.env.GEMINI_API_KEY`)
- ✅ No `NEXT_PUBLIC_*` prefix for sensitive keys (except where intentionally public)
- ✅ All external API calls go through Next.js API routes (BFF pattern)
- ✅ `.env` and `.env*.local` are in `.gitignore`

### 2. BFF (Backend for Frontend) Pattern

All external API calls are proxied through Next.js API routes:

- `/api/assistant/*` - Proxies to Machina API
- `/api/article/*` - Proxies to Machina API
- `/api/thread/*` - Proxies to Machina API

This ensures:

- API keys never reach the client
- CORS issues are handled server-side
- Request/response can be transformed server-side

## ⚠️ Potential Security Issues

### 1. Unused Client with Public API Key Reference

**File:** `libs/client/machina-api.client.ts`
**Issue:** Contains reference to `NEXT_PUBLIC_MACHINA_API_KEY` (line 15)
**Status:** ⚠️ Not currently used, but should be removed or documented

**Recommendation:**

- Remove this file if not needed, OR
- Add clear warning that it should NOT be used with `NEXT_PUBLIC_MACHINA_API_KEY`
- Ensure it's only used server-side if kept

**Current Usage:** The file is imported in `providers/assistant/service.ts` but the service uses `ClientBaseService` and proxy routes instead.

### 2. Documentation Contains API Keys

**Files:** `MACHINA_INTEGRATION.md`, `scripts/test-gemini.js`
**Issue:** Contains example/hardcoded API keys
**Status:** ⚠️ Should use placeholders or be removed

**Recommendation:**

- Replace real keys with placeholders like `YOUR_API_KEY_HERE`
- Add warning about never committing real keys

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] No `NEXT_PUBLIC_MACHINA_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY` in production `.env`
- [ ] All API routes use server-side env vars (`MACHINA_API_KEY`, `GEMINI_API_KEY`)
- [ ] `.env` files are in `.gitignore`
- [ ] No API keys in committed files
- [ ] All external API calls go through `/api/*` proxy routes
- [ ] Client-side code never directly calls external APIs with keys

## 📝 Security Guidelines for Developers

1. **Never use `NEXT_PUBLIC_*` for sensitive keys**
   - Only use for non-sensitive config (URLs, feature flags)
   - API keys should always be server-side only

2. **Always use BFF pattern**
   - Create `/app/api/*` routes for external API calls
   - Keep authentication server-side

3. **Environment Variables**
   - Use `.env.local` for local development
   - Never commit `.env` files
   - Use GitHub Secrets/Variables for CI/CD

4. **Code Review Checklist**
   - Check for `NEXT_PUBLIC_*` usage with sensitive data
   - Verify all external API calls go through proxy routes
   - Ensure no hardcoded keys in code

## 🔒 Production Deployment Security

### Required Environment Variables (Server-side only)

```bash
# Machina API (server-side only)
MACHINA_API_KEY=your_key_here
MACHINA_CLIENT_URL=https://api.machina.gg

# Gemini API (server-side only, optional)
GEMINI_API_KEY=your_key_here
```

### Public Environment Variables (safe for client)

```bash
# These can be public
NEXT_PUBLIC_BRAND=default
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=My App
```

---

**Last Updated:** 2025-01-17
**Reviewed By:** AI Assistant + Manual Review
