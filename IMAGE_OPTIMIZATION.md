# Image Optimization - IGE Project

## Overview
This document describes the image optimization implementation using Next.js Image component for automatic optimization, lazy loading, and modern format support (AVIF, WebP).

## Configuration

### next.config.js
Configured Next.js Image with:
- **Remote Patterns**: Whitelist for external image sources
  - `images.unsplash.com` (demo images)
  - `localhost` (development uploads)
  - `*.cloudinary.com` (production CDN option)
  - `*.amazonaws.com` (S3 bucket option)
- **Formats**: `['image/avif', 'image/webp']` - Modern formats with better compression
- **Device Sizes**: Responsive breakpoints `[640, 750, 828, 1080, 1200, 1920]`
- **Image Sizes**: Icon/thumbnail sizes `[16, 32, 48, 64, 96, 128, 256, 384]`

## Implementation

### Pages Updated

#### Admin Pages
1. **admin/projets/page.tsx**
   - Table thumbnails: 48x48px with `fill` and `sizes="48px"`
   
2. **admin/clubs/page.tsx**
   - Club logos: 32x32px with `fill` and `sizes="32px"`

3. **admin/partenaires/page.tsx**
   - Partner logos in table: 48x48px
   - Preview in form: 64x64px
   
4. **admin/blog/page.tsx**
   - Cover image preview: 128x96px (h-24 w-32)

5. **admin/bureau/page.tsx**
   - Member photos: Full width with responsive sizes
   - `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"`

#### Components
1. **components/admin/FileUpload.tsx**
   - Image preview: Full width with `sizes="(max-width: 768px) 100vw, 400px"`

#### Public Pages
All public detail pages (`projets/[id]`, `evenements/[id]`, `clubs/[slug]`) already use Next.js Image component with proper sizing and lazy loading.

### Exceptions
**QR Code images** in `/je-ge/page.tsx` remain as `<img>` tags because they use data URLs (`data:image/png;base64,...`) which Next.js Image doesn't support.

## Benefits

### 1. Automatic Optimization
- Images are automatically resized to match device size
- Modern formats (AVIF, WebP) served to supporting browsers
- Fallback to original format for older browsers

### 2. Performance
- Lazy loading: Images load only when entering viewport
- Responsive images: Correct size served based on screen
- Reduced bandwidth: Modern formats = 30-50% smaller files

### 3. Better UX
- Faster page loads
- No layout shift (width/height reserving space)
- Progressive loading with blur placeholder

## Usage Guidelines

### For New Images

```tsx
import Image from 'next/image';

// Fixed size
<div className="relative w-12 h-12">
  <Image 
    src={imageUrl} 
    alt="Description" 
    fill
    className="object-cover rounded"
    sizes="48px"
  />
</div>

// Responsive size
<div className="relative w-full aspect-video">
  <Image 
    src={imageUrl} 
    alt="Description" 
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
    priority={false} // true for above-the-fold images
  />
</div>
```

### Key Props

- **fill**: Makes image fill parent container (use with relative parent)
- **sizes**: Tells browser which size to load at different breakpoints
- **priority**: Load image immediately (for hero images)
- **quality**: 1-100, default is 75
- **placeholder**: "blur" | "empty" - Loading effect

### When to Use `<img>` Instead

- Data URLs (base64, QR codes)
- SVGs (they're already optimized)
- Animated GIFs (Image component doesn't preserve animation)

## Migration Checklist

✅ Configure `next.config.js` with remote patterns
✅ Update admin pages with Image component
✅ Update components with Image component
✅ Keep QR code as `<img>` (data URL)
✅ Test all image displays work correctly
✅ Verify responsive behavior on different screen sizes

## Production Recommendations

1. **Use a CDN**: Configure Cloudinary or AWS S3 for image hosting
2. **Enable caching**: Set proper cache headers on image server
3. **Monitor performance**: Use Lighthouse to track image optimization scores
4. **Consider blur placeholders**: Add low-quality image placeholders for better UX

## Testing

Test on different devices/browsers:
- Mobile (320px - 768px)
- Tablet (768px - 1024px)
- Desktop (1024px+)
- Check modern format delivery in DevTools Network tab
- Verify lazy loading with scroll behavior
