# Multi-Language Support Implementation

## ✅ What Was Added

### 1. **i18n Packages Installed**
- `i18next` - Core internationalization framework
- `i18next-http-middleware` - Express.js middleware for i18n
- `i18next-fs-backend` - File system backend to load translations
- `cookie-parser` - To store language preference in cookies

### 2. **Translation Files Created**
Located in `/locales/` folder:
- `en/translation.json` - English translations
- `es/translation.json` - Spanish translations  
- `fr/translation.json` - French translations

**You can easily add more languages** by creating new folders like `de/translation.json` for German.

### 3. **Configuration**
- `src/config/i18n.ts` - i18n configuration
  - Default language: English (en)
  - Supported languages: English, Spanish, French
  - Language detection order: URL query → Cookie → Browser header
  - Language preference stored in cookie (persists 1 year)

### 4. **Backend Changes (src/index.ts)**
- Added i18n middleware to Express
- Created `/change-language` POST endpoint
- Made translation function `t()` available in all Nunjucks templates
- Added `currentLanguage` variable to templates

### 5. **Frontend Changes (views/layouts/base.njk)**
- **Language selector dropdown** added to navbar (with globe icon 🌐)
- Shows 3 languages with flag emojis: 🇬🇧 English, 🇪🇸 Español, 🇫🇷 Français
- Navigation links now use translation keys: `{{ t('nav.home') }}`, `{{ t('nav.jobRoles') }}`
- JavaScript function `changeLanguage()` to switch languages
- Active language is highlighted in the dropdown

### 6. **Accessibility CSS Added**
- `.sr-only` class for screen-reader-only content
- `.focus:not-sr-only` for skip links that appear on focus

## 🎯 How It Works

1. **User clicks language in dropdown** → JavaScript calls `changeLanguage('es')`
2. **POST request to `/change-language`** → Sets cookie with language preference
3. **Page reloads** → i18n middleware reads cookie and sets language
4. **All `{{ t('key') }}` calls** → Return text in selected language
5. **Language persists** across page visits (stored in cookie)

## 📝 How to Use in Templates

Replace hardcoded text with translation keys:

**Before:**
```html
<h1>Welcome to Job Application System</h1>
```

**After:**
```html
<h1>{{ t('home.welcome') }}</h1>
```

## 🌍 Adding More Languages

1. Create new folder: `/locales/de/translation.json`
2. Copy structure from `en/translation.json`
3. Translate all values
4. Update `src/config/i18n.ts`:
   ```typescript
   supportedLngs: ["en", "es", "fr", "de"],
   preload: ["en", "es", "fr", "de"],
   ```
5. Add to navbar dropdown in `base.njk`:
   ```html
   <li><a href="#" onclick="changeLanguage('de')">🇩🇪 Deutsch</a></li>
   ```

## 🧪 Testing

1. **Visit http://localhost:3000**
2. **Click the globe icon (🌐)** in the top-right navbar
3. **Select a language** - page will reload in that language
4. **Navigate around** - language persists
5. **Check browser DevTools** → Application → Cookies → see `i18next` cookie

## 📁 Files Modified/Created

**Created:**
- `/locales/en/translation.json`
- `/locales/es/translation.json`
- `/locales/fr/translation.json`
- `/src/config/i18n.ts`

**Modified:**
- `/src/index.ts` - Added i18n middleware and language endpoint
- `/views/layouts/base.njk` - Added language selector and translation keys
- `/src/styles/main.css` - Added accessibility utilities
- `/package.json` - Added dependencies (via npm install)

## ⚠️ Important Notes

1. **Existing pages need updates** - Replace hardcoded text with `{{ t('key') }}` in:
   - `views/index.njk`
   - `views/job-role-list.njk`
   - `views/job-role-detail.njk`

2. **Add more translation keys** as needed in all language files

3. **Language automatically updates** the `<html lang="...">` attribute for accessibility

## 🎨 What You'll See

- **Globe icon (🌐)** next to theme toggle in navbar
- **Dropdown with 3 languages** (English, Español, Français)
- **Active language highlighted** in dropdown
- **Navigation text changes** based on selected language
- **Language persists** on refresh

## 🚀 Everything is working! Test it at http://localhost:3000
