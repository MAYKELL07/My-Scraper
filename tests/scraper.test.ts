import { test, expect } from '@playwright/test';

test('Scrape youchat text from you.com', async ({ page }) => {
    // Navigate to the target website
    await page.goto('https://you.com');

    // Wait for the textarea to be visible
    await page.waitForSelector('#search-input-textarea', { state: 'visible' });

    // Input text into the textarea
    await page.fill('#search-input-textarea', "what's your name");

    // Press Enter
    await page.keyboard.press('Enter');

    // Wait for the response
    await page.waitForSelector('[data-testid="youchat-text"]');

    // Scrape the text
    const scrapedText = await page.textContent('[data-testid="youchat-text"]');

    // Assert the scraped text (optional, based on your requirements)
    expect(scrapedText).toBeTruthy();

    // Output the scraped text to the console (for debugging purposes)
    console.log(scrapedText);
});
