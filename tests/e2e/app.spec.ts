import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.describe("Rafithub Public & Admin E2E", () => {
  test.afterAll(async () => {
    // Clean up any synthetic E2E rows from production DB
    const testMembers = await prisma.member.findMany({
      where: { phone: { startsWith: "+919999900" } },
      select: { id: true },
    });
    const memberIds = testMembers.map((m) => m.id);
    if (memberIds.length > 0) {
      await prisma.attendance.deleteMany({ where: { memberId: { in: memberIds } } });
      await prisma.payment.deleteMany({ where: { memberId: { in: memberIds } } });
      await prisma.membership.deleteMany({ where: { memberId: { in: memberIds } } });
      await prisma.bodyMeasurement.deleteMany({ where: { memberId: { in: memberIds } } });
      await prisma.member.deleteMany({ where: { id: { in: memberIds } } });
    }
    await prisma.lead.deleteMany({
      where: { phone: { startsWith: "+919999900" } },
    });
    await prisma.$disconnect();
  });

  test("public pages render without errors and preserve canonical trainer slugs", async ({ page }) => {
    for (const route of ["/", "/membership", "/trainers", "/trainers/rajith", "/classes", "/gallery", "/about", "/contact"]) {
      const res = await page.goto(route);
      expect(res?.status()).toBeLessThan(400);
    }

    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("tab", { name: /fitness check/i })).toBeVisible();
    await page.getByRole("tab", { name: /free trial/i }).click();
    await expect(page.getByRole("button", { name: /book 7-day free trial/i })).toBeVisible();
    await page.getByRole("tab", { name: /fitness check/i }).click();
    await expect(page.getByText(/bmi calculator/i).first()).toBeVisible();
  });

  test("visible Admin Login button on home navigates to /login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/");
    const adminLoginLink = page.getByRole("link", { name: /admin login/i }).first();
    await expect(adminLoginLink).toBeVisible();
    await adminLoginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("public lead capture submits and cleans up cleanly", async ({ page }) => {
    const testPhone = "+919999900111";
    await page.goto("/contact");
    await page.getByPlaceholder("Your name").fill("E2E Prospect");
    await page.getByPlaceholder("+91 98765 43210").fill(testPhone);
    await page.locator('input[type="checkbox"]').first().check();
    await page.locator('form button[type="submit"]').first().click();
    await expect(page.getByText(/enquiry received/i)).toBeVisible({ timeout: 10000 });
  });

  test("owner sign-in, dashboard, members, payments, attendance, leads, and reports work end-to-end", async ({
    page,
  }) => {
    const email = process.env.OWNER_EMAIL;
    const password = process.env.OWNER_INITIAL_PASSWORD;
    test.skip(!email || !password, "OWNER_EMAIL and OWNER_INITIAL_PASSWORD must be set");

    await page.goto("/login");
    await page.locator("#email").fill(email!);
    await page.locator("#password").fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });
    await expect(page.getByRole("heading", { name: /operations dashboard/i })).toBeVisible({
      timeout: 20000,
    });

    // Check navigation across newly built modules
    for (const path of [
      "/admin/members",
      "/admin/payments",
      "/admin/attendance",
      "/admin/leads",
      "/admin/reports",
      "/admin/settings",
    ]) {
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(400);
    }

    // Exercise member creation, manual payment & attendance check-in
    const memberPhone = "+919999900222";
    await page.goto("/admin/members");
    await page.getByRole("button", { name: /add member/i }).click();
    await page.getByPlaceholder("Full Name *").fill("E2E Test Member");
    await page.getByPlaceholder("Phone * (+91...)").fill(memberPhone);
    await page.getByRole("button", { name: /save member/i }).click();
    await expect(page.getByText("E2E Test Member").first()).toBeVisible({ timeout: 10000 });

    await page.goto("/admin/payments");
    const memberOptionValue = await page
      .locator("form select")
      .first()
      .locator("option", { hasText: "E2E Test Member" })
      .getAttribute("value");
    expect(memberOptionValue).toBeTruthy();
    await page.locator("form select").first().selectOption(memberOptionValue!);
    await page.getByPlaceholder("Amount (INR)").fill("1500");
    await page.getByRole("button", { name: /record payment/i }).click();
    await expect(page.getByText(/payment recorded/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /print receipt/i }).first()).toBeVisible();
    await page.getByRole("link", { name: /print receipt/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/receipts\//);
    await expect(page.getByText(/payment receipt/i)).toBeVisible();

    await page.goto("/admin/attendance");
    await page.locator("#qr-pass-input").fill(memberPhone);
    await page.getByRole("button", { name: /check in via qr/i }).click();
    await expect(page.getByText(/checked in E2E Test Member/i)).toBeVisible({ timeout: 10000 });
  });
});
