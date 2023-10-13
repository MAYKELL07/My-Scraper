import { chromium } from '@playwright/test';

async function scrapeYouChatText() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Navigate to the target website
    await page.goto('https://you.com');

    // Input text into the textarea
    await page.fill('#search-input-textarea', "what's your name");
    console.log("p1")

    // Press Enter
    await page.keyboard.press('Enter');
    console.log("p1")

    // Wait for the response
    await page.waitForSelector('[data-testid="youchat-text"]');

    // Scrape the text
    const scrapedText = await page.textContent('[data-testid="youchat-text"]');

    // Output the scraped text to the console
    console.log(scrapedText);

    await browser.close();
}

scrapeYouChatText();
