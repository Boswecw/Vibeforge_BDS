# Compression Setup Guide

## Current State

Build assets are generated but not pre-compressed for static serving.

## Recommended: Pre-compression

Pre-compress assets during build to avoid runtime compression overhead.

### 1. Install Compression Plugin

```bash
pnpm add -D vite-plugin-compression
```

### 2. Update vite.config.ts

```typescript
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // ... existing plugins

    // Brotli compression (better than gzip, ~20% smaller)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024, // Only compress files > 1KB
      deleteOriginFile: false
    }),

    // Gzip compression (fallback for older browsers)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    })
  ]
});
```

### 3. Server Configuration

#### SvelteKit Adapter (adapter-node)

**Update server to serve pre-compressed files:**

```javascript
// server/index.js or custom server
import compression from 'compression';
import express from 'express';
import { handler } from './build/handler.js';

const app = express();

// Serve pre-compressed files
app.use((req, res, next) => {
  // Check for .br (brotli) files first
  if (req.url.match(/\.(js|css|svg|json)$/)) {
    const brPath = req.url + '.br';
    if (fs.existsSync('./build/client' + brPath)) {
      req.url = brPath;
      res.set('Content-Encoding', 'br');
      res.set('Content-Type', getContentType(req.url.replace('.br', '')));
    }
    // Fallback to .gz (gzip)
    else if (fs.existsSync('./build/client' + req.url + '.gz')) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      res.set('Content-Type', getContentType(req.url.replace('.gz', '')));
    }
  }
  next();
});

app.use(handler);
app.listen(3000);
```

#### Tauri (Desktop App)

**Pre-compressed assets are included in the app bundle:**
- No additional server configuration needed
- Tauri automatically serves static files
- Pre-compression reduces bundle size

#### Static Hosting (Netlify, Vercel, Cloudflare Pages)

**These platforms automatically detect and serve .br and .gz files:**
- Netlify: Auto-detects .br and .gz
- Vercel: Auto-compression enabled by default
- Cloudflare Pages: Auto-compression

**No additional configuration needed!**

## Compression Results

### Expected Compression Ratios

**JavaScript (.js):**
- Gzip: ~60-70% reduction (163KB → ~50KB)
- Brotli: ~70-75% reduction (163KB → ~40KB)

**CSS (.css):**
- Gzip: ~70-80% reduction (21KB → ~5KB)
- Brotli: ~75-85% reduction (21KB → ~3.5KB)

**Fonts (.woff2):**
- Already compressed (WOFF2 is compressed format)
- No additional compression needed

### Build Size Comparison

**Before Compression:**
- JS (all chunks): ~350KB
- CSS (all files): ~140KB
- **Total:** ~490KB

**After Gzip:**
- JS: ~120KB (66% reduction)
- CSS: ~35KB (75% reduction)
- **Total:** ~155KB (68% reduction)

**After Brotli:**
- JS: ~90KB (74% reduction)
- CSS: ~25KB (82% reduction)
- **Total:** ~115KB (77% reduction)

## Implementation Steps

1. **Install plugin:**
   ```bash
   pnpm add -D vite-plugin-compression
   ```

2. **Add to vite.config.ts:**
   - Brotli compression (.br)
   - Gzip compression (.gz)

3. **Build and verify:**
   ```bash
   pnpm build
   ls -lh .svelte-kit/output/client/_app/immutable/chunks/*.{br,gz}
   ```

4. **Deploy:**
   - Static hosts: Auto-detected
   - Custom server: Configure pre-compressed file serving
   - Tauri: Included in app bundle

## Verification

**Check compression in production:**

```bash
# Check response headers
curl -I -H "Accept-Encoding: br, gzip" https://your-domain.com/app.js

# Should see:
# Content-Encoding: br
# or
# Content-Encoding: gzip
```

## Additional Optimizations

### 1. Content-Type Headers

Ensure correct MIME types:
- `.js` → `application/javascript`
- `.css` → `text/css`
- `.woff2` → `font/woff2`
- `.svg` → `image/svg+xml`

### 2. Cache-Control Headers

**Immutable assets (/_app/immutable/):**
```
Cache-Control: public, max-age=31536000, immutable
```

**HTML files:**
```
Cache-Control: public, max-age=0, must-revalidate
```

### 3. CDN Configuration

If using CDN (Cloudflare, etc.):
- Enable Auto Minify (JS, CSS, HTML)
- Enable Brotli compression
- Enable HTTP/2 Push for critical resources

## Measurement

**Before deployment:**
```bash
# Measure bundle sizes
du -sh .svelte-kit/output/client/_app/immutable/chunks/*.js
```

**After deployment:**
```bash
# Measure transferred sizes
curl -o /dev/null -s -w "%{size_download}\n" https://your-domain.com/app.js
```

**Web Vitals Impact:**
- Faster download times
- Improved TTI (Time to Interactive)
- Better FCP (First Contentful Paint)
- Reduced bandwidth usage

## Checklist

- [ ] Install vite-plugin-compression
- [ ] Add Brotli compression to vite.config.ts
- [ ] Add Gzip compression to vite.config.ts
- [ ] Build and verify .br and .gz files created
- [ ] Configure server to serve pre-compressed files (if using custom server)
- [ ] Test compression in production
- [ ] Verify correct Content-Encoding headers
- [ ] Measure bundle size improvements
- [ ] Update deployment documentation
