import {expect, test} from "@playwright/test";

test("selects a vehicle, assesses risk, and checks a next step", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button", {name: /2020 Nissan/}).click();
  await page.getByRole("button", {name: "Build buyer brief"}).click();
  await expect(page.getByText("Pass for now")).toBeVisible();
  await expect(page.getByText("Battery health is 78%")).toBeVisible();
  await page.getByLabel("Verify VIN, title, recalls, and warranty").check();
  await expect(page.getByText("1/3 ready")).toBeVisible();
});

test("shows invalid input and a strong-fit brief", async ({page}) => {
  await page.goto("/");
  await page.getByLabel("Maximum budget").fill("100");
  await page.getByRole("button", {name: "Build buyer brief"}).click();
  await expect(page.locator(".error")).toHaveText("Enter a budget from $5,000 to $150,000.");
  await page.getByLabel("Maximum budget").fill("23000");
  await page.getByRole("button", {name: /2023 Chevrolet/}).click();
  await page.getByRole("button", {name: "Build buyer brief"}).click();
  await expect(page.getByText("Inspect first")).toBeVisible();
});

test("mobile view has no horizontal overflow", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only overflow assertion");
  await page.goto("/");
  await page.getByRole("button", {name: "Build buyer brief"}).click();
  const dimensions = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
});
