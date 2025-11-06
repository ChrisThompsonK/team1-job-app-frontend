---
applyTo: '**'
---

# AI Testing Instructions for This Project

## Overview
This project uses a multi-layered testing approach, including:
- **Gherkin/Cucumber** for BDD-style feature tests
- **Playwright** for end-to-end (E2E) browser automation
- **Vitest** for unit and integration testing

AI must follow these guidelines when generating, reviewing, or answering questions about tests in this project.

---

## General Testing Principles

1. **Test Types:**
	- Use **unit tests** for isolated logic (e.g., services, utilities)
	- Use **integration tests** for multiple modules working together
	- Use **E2E tests** for user flows and UI (via Playwright)
	- Use **BDD/feature tests** for business requirements (Gherkin/Cucumber)

2. **Test Structure:**
	- Organize tests by feature or module
	- Use clear, descriptive names for test files and cases
	- Group related tests using `describe`/`context` blocks (Vitest)
	- Use Gherkin syntax (`Feature`, `Scenario`, `Given/When/Then`) for Cucumber

3. **Test Quality:**
	- Write tests that are deterministic and repeatable
	- Prefer small, focused tests over large, brittle ones
	- Ensure tests are independent (no hidden dependencies)
	- Use setup/teardown hooks for consistent state

4. **Test Data:**
	- Use fixtures or factories for reusable test data
	- Avoid hardcoding values unless necessary

5. **Assertions:**
	- Use clear, expressive assertions (e.g., `expect(...).toBe(...)`)
	- Check both positive and negative cases

6. **Coverage:**
	- Strive for high code coverage, but prioritize meaningful tests over 100% coverage
	- Use coverage tools (e.g., `vitest --coverage`) and report results

7. **Continuous Integration:**
	- Ensure all test types run automatically on every commit/PR
	- Fail builds on test or lint errors

8. **Reporting:**
	- Output readable, actionable, and visually rich test results for all test types
	- Use or generate visual reports for Vitest and Cucumber (e.g., HTML reports, dashboards)
	- For Playwright, leverage and build on its built-in visual reporting features
	- Include screenshots for failed tests or important steps where possible (especially E2E and integration)
	- Ensure error messages are clear, helpful, and include stack traces or context
	- If test data or fixtures are used, display or link this data in the report for debugging
	- Aggregate reports for E2E, unit, and integration tests in a central location
	- Make reports easily accessible for developers and CI review

9. **Performance:**
	- Keep tests fast; use watch mode for local development
	- Mark slow/integration/E2E tests clearly

10. **Accessibility:**
	- Where possible, include accessibility checks in E2E tests

---

## Tool-Specific Guidelines

### Gherkin/Cucumber (BDD)
- Write feature files in plain English using Gherkin syntax
- Each `Scenario` should map to a real user story or requirement
- Step definitions should be reusable and DRY
- Use tags to organize and filter scenarios
- Keep feature files concise and focused

### Playwright (E2E)
- Use Playwright for simulating real user interactions
- Structure tests to reflect user journeys (login, apply, etc.)
- Prefer selectors that are robust (e.g., data-testid, role)
- Clean up state between tests (e.g., clear cookies, reset DB if possible)
- Use Playwright's built-in assertions for UI checks
- Consider accessibility checks (e.g., `expect(page).toBeAccessible()` if supported)
 - **Keep E2E tests to a small number, each covering a large, realistic user flow.** Avoid writing E2E tests as UI unit tests—do not test small UI components or isolated interactions at the E2E level. Focus on end-to-end scenarios that reflect actual user journeys.
 - **Always interact with the UI as a user would:** Do not change URLs directly to navigate; use buttons, links, or other visible controls to move between pages.
 - **Locator accuracy:** Never guess selectors or locators. Either ask the user for the correct locator or connect to the Playwright MCP to inspect and verify the actual selectors in the running app.
 - **Use the Page Object Model (POM):** Organize E2E tests using the Page Object Model to encapsulate page structure and actions, improving maintainability and readability.
 - **Set up pre and post hooks:** Use hooks to prepare test data, take screenshots on failure, and clean up after tests to ensure consistent, reliable test runs.

### Vitest (Unit/Integration)
- Use Vitest for fast, isolated tests of logic and services
- Group related tests with `describe`
- Use `beforeEach`/`afterEach` for setup/teardown
- Prefer `const` for test variables
- Avoid using `any` type; use explicit types
- Use mocking/stubbing for dependencies where possible (see below)

---

## Mocking, Stubbing, and Isolation

> **Note:** As of now, full mocking/stubbing frameworks may not be implemented in this project. Do not generate code that relies on advanced mocking/stubbing unless explicitly instructed. When support is added, follow best practices below:

- Use mocks/stubs to isolate units from external dependencies (APIs, DB, etc.)
- Prefer dependency injection for easier testability
- Use test doubles for network requests, timers, etc.
- Reset mocks between tests to avoid state leakage

---

## Best Practices Checklist

- [ ] All new code is covered by appropriate tests
- [ ] Tests are clear, maintainable, and follow project structure
- [ ] No unused or duplicate test code
- [ ] Test output is readable and actionable
- [ ] Tests run in CI and block on failure
- [ ] Linting and formatting are enforced in test code
- [ ] No use of `any` or non-null assertions in test code
- [ ] No hardcoded credentials or secrets in tests
- [ ] Use only supported libraries and patterns

---

## Learning Tool Considerations

This repository is also a learning tool, so:
- **Not every component or feature requires complete test coverage.**
- After adding new features or code, AI should ask the user if they want tests and to what level of coverage or detail.
- Only proceed with generating or updating tests if the user requests it.
- When asked to add or update tests, always follow the documentation and best practices above.

---

## When Generating or Reviewing Tests

1. Follow the above principles and tool-specific guidelines
2. If a feature (e.g., mocking) is not available, note this in comments and avoid using it
3. Prefer existing patterns and structures in the codebase
4. Document any assumptions or limitations in the test code
5. Keep tests up to date with code changes

---

## References
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Cucumber.js Docs](https://cucumber.io/docs/)

---

**Summary:**
AI should generate and review tests that are maintainable, reliable, and aligned with the current capabilities of the project. Anticipate future improvements (like mocking/stubbing) but do not use them unless explicitly enabled. Always prioritize clarity, coverage, and integration with CI.