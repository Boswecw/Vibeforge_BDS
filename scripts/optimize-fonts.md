# Font Optimization Guide

## Current Font Usage

**Fonts Identified:**
- Cinzel-Light.woff2 (1.6KB) - Heading font
- Inter-Regular.woff2 (22KB) - Body font
- Inter-Medium.woff2 (23KB) - Body font (medium weight)
- Inter-SemiBold.woff2 (1.6KB) - Body font (semi-bold)
- JetBrainsMono-Regular.woff2 (91KB) - Monospace font
- JetBrainsMono-Bold.woff2 (93KB) - Monospace font (bold)

**Total:** 232KB

## Optimization Opportunities

### 1. JetBrains Mono (184KB total)

These are the largest fonts. They include many glyphs for code rendering.

**Optimization Strategy:**
- Subset to Latin characters only (reduces by ~50-60%)
- Include only commonly used programming characters
- Expected size after subsetting: ~50-70KB total

**Subsetting Command (requires `pyftsubset` from fonttools):**

```bash
# Install fonttools
pip install fonttools brotli

# Subset JetBrains Mono Regular
pyftsubset static/fonts/JetBrainsMono-Regular.woff2 \
  --output-file=static/fonts/JetBrainsMono-Regular-subset.woff2 \
  --flavor=woff2 \
  --layout-features=* \
  --unicodes=U+0020-007F,U+00A0-00FF,U+2010-2027,U+2030-205E

# Subset JetBrains Mono Bold
pyftsubset static/fonts/JetBrainsMono-Bold.woff2 \
  --output-file=static/fonts/JetBrainsMono-Bold-subset.woff2 \
  --flavor=woff2 \
  --layout-features=* \
  --unicodes=U+0020-007F,U+00A0-00FF,U+2010-2027,U+2030-205E
```

**After subsetting, update CSS:**
```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular-subset.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  unicode-range: U+0020-007F, U+00A0-00FF, U+2010-2027, U+2030-205E;
}
```

### 2. Inter (46.6KB total)

Already quite optimized. Could subset further but may not be worth it.

**Current state:** Good
**Recommendation:** Leave as-is or subset to Latin-1 if needed

### 3. Cinzel (1.6KB)

Very small, no optimization needed.

## Font Loading Optimization

### Current: No font-display specified
### Recommended: Add font-display

**Update `src/app.css`:**

```css
@font-face {
  font-family: 'Cinzel';
  src: url('/fonts/Cinzel-Light.woff2') format('woff2');
  font-weight: 300;
  font-display: swap; /* Show fallback immediately */
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

## Preloading Critical Fonts

**Add to `src/app.html` (if needed for LCP):**

```html
<head>
  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/Cinzel-Light.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

**Note:** Only preload fonts used above-the-fold to avoid delaying other resources.

## Expected Savings

**Current:** 232KB
**After subsetting JetBrains Mono:** ~160KB
**Savings:** ~70KB (30% reduction)

**Additional savings from font-display:**
- Improved First Contentful Paint (FCP)
- Reduced Cumulative Layout Shift (CLS)
- Better user experience during font loading

## Implementation Checklist

- [ ] Install fonttools: `pip install fonttools brotli`
- [ ] Subset JetBrains Mono fonts (see commands above)
- [ ] Add `font-display: swap` to all @font-face declarations
- [ ] Test font rendering across different browsers
- [ ] Consider preloading critical fonts (Inter, Cinzel)
- [ ] Update CSS to reference subset fonts
- [ ] Verify no missing glyphs in code blocks
- [ ] Measure impact on Web Vitals

## Alternative: Variable Fonts

**Future consideration:** Switch to variable fonts to reduce file count while maintaining multiple weights.

**Inter Variable Font:**
- Single file for all weights
- ~100-150KB for full range
- Better than loading 3 separate files

**JetBrains Mono Variable:**
- Not yet available as variable font
- Subsetting is best option currently
