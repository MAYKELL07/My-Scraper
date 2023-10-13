import { chromium, Browser, Page, test, expect } from '@playwright/test';

let browser: Browser;

let page: Page;

test.beforeAll(async () => {

  browser = await chromium.launch();

  page = await browser.newPage();

});

test('Example Test', async () => {

  await page.goto('https://example.com');

  const title = await page.title();

  expect(title).toBe('Example Domain');

});

test.afterAll(async () => {

  await browser.close();

});