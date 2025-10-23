# Galano Grotesque Font Files

This directory should contain the Galano Grotesque font files used by the Kainos website.

## Required Font Files

You need to add the following Galano Grotesque font files to this directory:

### Regular Weight (400)
- `GalanoGrotesque-Regular.woff2`
- `GalanoGrotesque-Regular.woff`

### Medium Weight (500)
- `GalanoGrotesque-Medium.woff2`
- `GalanoGrotesque-Medium.woff`

### Semi-Bold Weight (600)
- `GalanoGrotesque-SemiBold.woff2`
- `GalanoGrotesque-SemiBold.woff`

### Bold Weight (700)
- `GalanoGrotesque-Bold.woff2`
- `GalanoGrotesque-Bold.woff`

## Where to Get the Fonts

**Important:** Galano Grotesque is a commercial font. You must have a valid license to use it.

### Options:
1. **From Kainos Design Team** - Contact your design team for the licensed font files
2. **Purchase License** - Available from font distributors like MyFonts or Fontspring
3. **Company License** - Check if your company already has a license

## Font Formats

- `.woff2` - Modern format with better compression (preferred)
- `.woff` - Fallback for older browsers

## Installation

1. Obtain the licensed font files
2. Place them in this directory (`/public/fonts/`)
3. Ensure the filenames match those listed above
4. The fonts are already configured in `/public/css/fonts.css`

## Alternative (If Font Files Are Not Available)

If you don't have access to the Galano Grotesque font files yet, you can:

1. Use a similar system font temporarily
2. Use a Google Fonts alternative like "Inter" or "Work Sans"
3. Contact the Kainos design/brand team for the licensed fonts

## Font Configuration

The font is configured in:
- **Font declarations:** `/public/css/fonts.css`
- **Tailwind config:** `/tailwind.config.js`
- **Loaded in:** `/views/layouts/base.njk`
