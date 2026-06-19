import { test, expect } from "@playwright/test";

test("hidden column persists across reload in table view", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Table view" }).click();

  await page.getByRole("button", { name: /columns/i }).click();
  await page.getByRole("checkbox", { name: /domain/i }).click();
  await expect(
    page.getByRole("columnheader", { name: /domain/i }),
  ).toHaveCount(0);

  await page.reload();

  // View choice persists too, so we land back on the table.
  await expect(
    page.getByRole("columnheader", { name: /domain/i }),
  ).toHaveCount(0);
});

test("resized column width persists across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Table view" }).click();

  const handle = page.getByRole("separator", {
    name: /resize state column/i,
  });
  const box = await handle.boundingBox();
  if (!box) throw new Error("resize handle not found");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();

  const header = page.getByRole("columnheader", { name: /^state/i });
  const widthAfterDrag = await header.evaluate(
    (el) => el.getBoundingClientRect().width,
  );

  await page.reload();

  const widthAfterReload = await page
    .getByRole("columnheader", { name: /^state/i })
    .evaluate((el) => el.getBoundingClientRect().width);

  expect(Math.abs(widthAfterReload - widthAfterDrag)).toBeLessThan(4);
});
