# Lucide Icons - Quick Reference

## 🎯 Essential Rules
- ✅ **ONLY use Lucide icons**: `<i data-lucide="icon-name" class="h-5 w-5"></i>`
- ❌ **NEVER create custom SVG elements**
- ❌ **NEVER use other icon libraries**

## 🔗 Resources
- **Icon Library**: https://lucide.dev/icons
- **Documentation**: https://lucide.dev/guide/
- **CDN**: `https://unpkg.com/lucide@latest/dist/umd/lucide.js`

## 📏 Standard Sizes
```html
<i data-lucide="icon" class="h-4 w-4"></i>  <!-- 16px - Small -->
<i data-lucide="icon" class="h-5 w-5"></i>  <!-- 20px - Medium -->
<i data-lucide="icon" class="h-6 w-6"></i>  <!-- 24px - Large -->
<i data-lucide="icon" class="h-8 w-8"></i>  <!-- 32px - Extra Large -->
```

## 🎨 Common Colors
```html
<i data-lucide="icon" class="h-5 w-5 text-primary"></i>
<i data-lucide="icon" class="h-5 w-5 text-base-content/40"></i>  <!-- Muted -->
<i data-lucide="icon" class="h-5 w-5 text-success"></i>
<i data-lucide="icon" class="h-5 w-5 text-error"></i>
```

## 🔥 Most Used Icons

### UI & Navigation
- `menu`, `x`, `search`, `home`
- `chevron-down`, `arrow-left`, `arrow-right`
- `eye`, `eye-off`, `sun`, `moon`

### Actions
- `plus`, `edit`, `trash-2`, `save`
- `download`, `upload`, `copy`, `link`

### Business
- `briefcase`, `building`, `map-pin`, `calendar`
- `user`, `users`, `mail`, `phone`

### Status
- `check`, `x`, `alert-triangle`, `info`

## 🚀 Quick Implementation
1. Find icon at https://lucide.dev/icons
2. Copy icon name
3. Use: `<i data-lucide="ICON-NAME" class="h-5 w-5"></i>`
4. Icons auto-render via `lucide.createIcons()` in base.njk

---
See `Icons.instructions.md` for complete guidelines.