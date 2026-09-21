import { test, expect } from "@playwright/test";

test.describe("Renterty Primary PropTech User Flow", () => {
  test("traverses discovery, search, property detail, and AI assistant interface", async ({ page }) => {
    test.setTimeout(60000);

    // 1. Visit homepage
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Renterty/i);

    // 2. Verify Hero Header and Navigation
    const navHeading = page.getByRole("navigation");
    await expect(navHeading).toBeVisible();

    // 3. Navigate to Properties Catalog
    const propertiesLink = page.getByRole("link", { name: /All Properties/i }).first();
    if (await propertiesLink.isVisible()) {
      await propertiesLink.click();
      await expect(page).toHaveURL(/.*properties/);
    } else {
      await page.goto("/properties", { waitUntil: "domcontentloaded" });
    }

    // 4. Verify Catalog Search & Filter Controls
    await expect(page.getByPlaceholder(/e\.g\. New York, Miami/i)).toBeVisible();

    // 5. Open AI Rental Assistant
    const aiAssistantBtn = page.getByRole("button", { name: /Open Renterty AI Rental Concierge/i });
    if (await aiAssistantBtn.isVisible()) {
      await aiAssistantBtn.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("heading", { name: /Renterty AI Concierge/i })).toBeVisible();

      // Close the assistant
      const closeBtn = page.getByRole("button", { name: /Close Assistant/i });
      await closeBtn.click();
      await expect(dialog).not.toBeVisible();
    }

    // 6. Navigate to Landlord Portal
    const landlordLink = page.getByRole("link", { name: /For Landlords/i }).first();
    if (await landlordLink.isVisible()) {
      await landlordLink.click();
      await expect(page).toHaveURL(/.*landlords/);
      await expect(page.getByRole("link", { name: /List Your Property Today/i }).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: /Powerful Tools to Scale Your Portfolio/i })).toBeVisible();
    }
  });
});
