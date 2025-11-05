# Playwright E2E Tests

This directory contains end-to-end tests using Playwright.

## Running Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Generate test report
npx playwright show-report
```

## Writing Tests

Tests should be placed in this directory with the `.spec.ts` extension.

Example test structure:
```typescript
import { test, expect } from "@playwright/test";

test("example test", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Expected Title/);
});
```

## Best Practices

1. Use data-testid attributes for reliable selectors
2. Keep tests independent and isolated
3. Use Page Object Model for complex flows
4. Clean up test data after tests complete
5. Use meaningful test descriptions
