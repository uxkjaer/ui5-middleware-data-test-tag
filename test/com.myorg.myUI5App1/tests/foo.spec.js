const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:8080/index.html');
  const inp = ""
  await page.fill("data-testid=inp >> input","World")
  await page.click("data-testid=btn")
});