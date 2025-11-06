---
applyTo: '**'
---

# Icon System Instructions - Lucide Icons Only

## Overview
This project uses **[Lucide Icons](https://lucide.dev/)** exclusively for all iconography. Lucide provides a comprehensive library of beautiful, consistent SVG icons that are loaded via CDN and rendered automatically.

## 🚨 Critical Rules

### ✅ ALWAYS USE LUCIDE ICONS
- **NEVER** create custom SVG elements
- **NEVER** use other icon libraries (Font Awesome, Heroicons, etc.)
- **ALWAYS** use the `data-lucide` attribute system
- **ALWAYS** check [lucide.dev/icons](https://lucide.dev/icons) for available icons

### ❌ Forbidden Practices
```html
<!-- ❌ WRONG: Custom SVG elements -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
</svg>

<!-- ❌ WRONG: Other icon libraries -->
<i class="fa fa-user"></i>
<svg class="heroicon-user">...</svg>
```

## 🎯 Correct Implementation

### Basic Icon Usage
```html
<!-- ✅ CORRECT: Basic Lucide icon -->
<i data-lucide="user" class="h-5 w-5"></i>

<!-- ✅ CORRECT: Icon with styling -->
<i data-lucide="search" class="h-6 w-6 text-primary"></i>

<!-- ✅ CORRECT: Icon in buttons -->
<button class="btn btn-primary">
    <i data-lucide="plus" class="h-4 w-4"></i>
    Add New
</button>
```

### Sizing Guidelines
```html
<!-- Small icons (16px) -->
<i data-lucide="icon-name" class="h-4 w-4"></i>

<!-- Medium icons (20px) -->
<i data-lucide="icon-name" class="h-5 w-5"></i>

<!-- Large icons (24px) -->
<i data-lucide="icon-name" class="h-6 w-6"></i>

<!-- Extra large icons (32px) -->
<i data-lucide="icon-name" class="h-8 w-8"></i>
```

### Color and State Styling
```html
<!-- Primary color -->
<i data-lucide="heart" class="h-5 w-5 text-primary"></i>

<!-- Muted/disabled state -->
<i data-lucide="lock" class="h-5 w-5 text-base-content/40"></i>

<!-- Success state -->
<i data-lucide="check" class="h-5 w-5 text-success"></i>

<!-- Error state -->
<i data-lucide="x" class="h-5 w-5 text-error"></i>
```

## 📚 Common Icons Reference

### Navigation & UI
- `menu` - Hamburger menu
- `x` - Close/cancel
- `chevron-down` - Dropdown arrow
- `chevron-left` / `chevron-right` - Navigation arrows
- `arrow-left` / `arrow-right` - Back/forward navigation
- `home` - Home page
- `search` - Search functionality

### User & Authentication
- `user` - User profile
- `users` - Multiple users/team
- `log-in` / `log-out` - Authentication
- `eye` / `eye-off` - Password visibility toggle
- `lock` - Security/password fields

### Actions & Controls
- `plus` - Add/create new
- `edit` / `edit-2` - Edit/modify
- `trash-2` - Delete/remove
- `save` - Save action
- `download` - Download files
- `upload` - Upload files
- `copy` - Copy to clipboard
- `refresh-cw` - Refresh/reload

### Communication
- `mail` - Email
- `phone` - Phone contact
- `message-square` - Chat/messaging
- `link` - URL/link sharing
- `printer` - Print action

### Business & Career
- `briefcase` - Jobs/career
- `building` - Company/office
- `map-pin` - Location
- `calendar` - Dates/scheduling
- `clock` - Time
- `dollar-sign` - Salary/money

### Social Media
- `linkedin` - LinkedIn
- `twitter` - Twitter/X
- `instagram` - Instagram
- `github` - GitHub

### Status & Feedback
- `check` - Success/completed
- `x` - Error/failed
- `alert-triangle` - Warning
- `info` - Information
- `help-circle` - Help/support

### Theme & Settings
- `sun` - Light mode
- `moon` - Dark mode
- `settings` - Configuration
- `palette` - Design/themes

## 🔧 Technical Implementation

### CDN Loading
Icons are loaded via CDN in the base layout:
```html
<!-- In views/layouts/base.njk -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

### Automatic Rendering
Icons are automatically rendered on page load:
```javascript
// At the end of base.njk
<script>
    lucide.createIcons();
</script>
```

### Dynamic Icon Addition
If adding icons dynamically via JavaScript:
```javascript
// After adding new icons to the DOM
lucide.createIcons();
```

## 🎨 Design Consistency

### Icon Spacing in Buttons
```html
<!-- ✅ CORRECT: Icon with gap -->
<button class="btn gap-2">
    <i data-lucide="search" class="h-4 w-4"></i>
    Search Jobs
</button>

<!-- ✅ CORRECT: Icon-only button -->
<button class="btn btn-square">
    <i data-lucide="heart" class="h-5 w-5"></i>
</button>
```

### Form Field Icons
```html
<!-- ✅ CORRECT: Input with icon -->
<div class="relative">
    <input type="email" class="input input-bordered w-full pl-10" />
    <i data-lucide="mail" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40"></i>
</div>
```

### Card Headers with Icons
```html
<!-- ✅ CORRECT: Card with icon -->
<div class="card">
    <div class="card-body">
        <div class="flex items-center gap-3">
            <i data-lucide="briefcase" class="h-6 w-6 text-primary"></i>
            <h2 class="card-title">Job Opportunities</h2>
        </div>
    </div>
</div>
```

## 🚀 Best Practices

1. **Always check icon availability** at [lucide.dev/icons](https://lucide.dev/icons) before implementation
2. **Use semantic icon names** that clearly represent their function
3. **Maintain consistent sizing** within similar UI components
4. **Apply appropriate colors** that match the design system
5. **Test icon rendering** after making changes
6. **Use meaningful alt text** for accessibility when needed

## 🔍 Finding the Right Icon

1. Visit [lucide.dev/icons](https://lucide.dev/icons)
2. Use the search function to find relevant icons
3. Click on an icon to copy its name
4. Use the exact name in the `data-lucide` attribute

## 📝 Examples from Current Project

### Login Form Icons
```html
<!-- Password field with lock icon -->
<i data-lucide="lock" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40"></i>

<!-- Password visibility toggle -->
<i data-lucide="eye" class="h-5 w-5"></i>
<i data-lucide="eye-off" class="h-5 w-5 hidden"></i>
```

### Navigation Icons
```html
<!-- Theme toggle -->
<i data-lucide="sun" class="swap-off w-6 h-6"></i>
<i data-lucide="moon" class="swap-on w-6 h-6"></i>

<!-- Social media links -->
<i data-lucide="linkedin" class="h-6 w-6"></i>
<i data-lucide="twitter" class="h-6 w-6"></i>
<i data-lucide="instagram" class="h-6 w-6"></i>
```

### Job Listing Features
```html
<!-- Hero section -->
<i data-lucide="briefcase" class="h-10 w-10"></i>

<!-- Feature cards -->
<i data-lucide="code" class="h-6 w-6 text-accent"></i>
<i data-lucide="server" class="h-6 w-6 text-secondary"></i>
<i data-lucide="palette" class="h-6 w-6 text-success"></i>
```

## ⚠️ Common Mistakes to Avoid

1. **Don't mix icon systems** - Only use Lucide in this project
2. **Don't create custom SVGs** - Use existing Lucide icons
3. **Don't forget to call `lucide.createIcons()`** after dynamic content
4. **Don't use incorrect icon names** - Always verify at lucide.dev
5. **Don't skip accessibility** - Consider screen readers when using icons

## 📞 Support

For questions about icon usage or if you can't find an appropriate Lucide icon for your use case, consult the [Lucide documentation](https://lucide.dev/guide/) or check existing implementations in the project.

---

**Remember**: Consistency is key. When in doubt, look at existing implementations in the project and follow the same patterns.