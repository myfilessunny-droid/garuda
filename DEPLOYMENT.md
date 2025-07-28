# 🚀 Deployment Guide

## Netlify Deployment

### Prerequisites
- Netlify account
- GitHub repository connected
- Supabase project configured
- Razorpay account (for payments)

### Step 1: Environment Variables

Set these environment variables in your Netlify dashboard:

**Go to**: Site settings → Environment variables

```
VITE_SUPABASE_URL=https://iovkyejegqvqxejmxrla.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvdmt5ZWplZ3F2cXhlam14cmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTk0ODUsImV4cCI6MjA2OTI3NTQ4NX0.Y4LFBB3fBnTdRTZDINi-9kknNFZvXmSduGXnCk4ENY8
VITE_RAZORPAY_TEST_KEY=rzp_test_3
```

### Step 2: Build Configuration

The `netlify.toml` file is already configured:

```toml
[build]
  publish = "dist"
  command = "npm ci && npm run build:prod"

[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"
  CI = "true"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Supabase Configuration

1. **Update Site URL**:
   - Go to Supabase Dashboard → Authentication → Settings
   - Set Site URL to: `https://garuda2.netlify.app`

2. **Add Redirect URLs**:
   - Add: `https://garuda2.netlify.app`
   - Add: `https://garuda2.netlify.app/auth/callback`

### Step 4: Razorpay Configuration

1. **Test Mode**: Currently using test keys
2. **Production**: Replace with live keys when ready
3. **Webhook URL**: Set to your Supabase edge function

### Step 5: Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Netlify Auto-Deploy**:
   - Netlify will automatically build and deploy
   - Monitor build logs for any issues

3. **Verify Deployment**:
   - Check: https://garuda2.netlify.app
   - Test donation functionality
   - Verify admin dashboard

## 🛠️ Build Process

### Local Build Test
```bash
npm run build:prod
```

### Build Output
- **Directory**: `dist/`
- **Files**: Optimized HTML, CSS, JS
- **Size**: ~2-3MB (gzipped)

### Performance Optimizations
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression
- ✅ CDN delivery

## 🔧 Troubleshooting

### Build Failures
1. **Check Node version**: Must be 18+
2. **Verify dependencies**: All packages installed
3. **Environment variables**: All required vars set

### Runtime Issues
1. **CORS errors**: Check Supabase settings
2. **Payment failures**: Verify Razorpay keys
3. **404 errors**: Check redirects configuration

### Performance Issues
1. **Slow loading**: Check bundle size
2. **Image optimization**: Use WebP format
3. **Caching**: Enable Netlify caching

## 📊 Monitoring

### Analytics
- Google Analytics (if configured)
- Netlify Analytics
- Supabase Dashboard

### Error Tracking
- Browser console logs
- Netlify function logs
- Supabase logs

## 🔄 Updates

### Code Updates
1. Make changes locally
2. Test with `npm run dev`
3. Build with `npm run build:prod`
4. Push to GitHub
5. Netlify auto-deploys

### Environment Updates
1. Update Netlify environment variables
2. Trigger new deployment
3. Clear cache if needed

## 🚀 Live Site

**URL**: https://garuda2.netlify.app

**Status**: ✅ Production Ready 