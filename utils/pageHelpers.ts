import { Page } from "@playwright/test";

/**
 * Handles consent popup that may appear on some pages
 * This popup appears locally but not in CI environments
 */
export async function handleConsentPopup(page: Page): Promise<void> {
  try {
    const consentButton = page.getByRole("button", { name: "Consent" });
    await consentButton.click({ timeout: 3000 });
  } catch {
    // Popup not found - this is normal in CI, continue silently
  }
}

/**
 * Common navigation helper that handles consent popup automatically
 */
export async function navigateAndHandleConsent(
  page: Page,
  url: string,
): Promise<void> {
  await page.goto(url);
  await handleConsentPopup(page);
}
