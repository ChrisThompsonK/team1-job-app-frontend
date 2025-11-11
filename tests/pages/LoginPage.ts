import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private emailInput: Locator;
  private passwordInput: Locator;
  private signInButton: Locator;
  private signUpTabButton: Locator;
  private signUpPasswordInput: Locator;
  private confirmPasswordInput: Locator;
  private termsCheckbox: Locator;
  private createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Email Address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.signUpTabButton = page.getByRole("button", { name: "Sign Up" });
    this.signUpPasswordInput = page.locator("#signup-password");
    this.confirmPasswordInput = page.getByRole("textbox", {
      name: "Confirm Password",
    });
    this.termsCheckbox = page.getByRole("checkbox", {
      name: "I agree to the Terms of Service and Privacy Policy",
    });
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });
  }

  async navigateToLogin(): Promise<void> {
    const loginLink = this.getLoginLink();
    await loginLink.click();
    await this.waitForNetworkIdle();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.waitForNetworkIdle();
  }

  async switchToSignUp(): Promise<void> {
    await this.signUpTabButton.click();
    // Wait for the signup form to be visible
    await this.createAccountButton.waitFor({ state: "visible" });
  }

  async fillRegistrationForm(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.signUpPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async acceptTermsIfPresent(): Promise<void> {
    await this.termsCheckbox.check();
  }

  async submitRegistration(): Promise<void> {
    await this.createAccountButton.click();
    await this.waitForNetworkIdle();
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.switchToSignUp();
    await this.fillRegistrationForm(email, password, confirmPassword);
    await this.acceptTermsIfPresent();
    await this.submitRegistration();
  }

  async togglePasswordVisibility(): Promise<void> {
    const passwordContainer = this.passwordInput.locator("..");
    const toggleButton = passwordContainer.locator("button").first();
    await toggleButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.signInButton.click();
    await this.waitForFormResponse();
  }
}
