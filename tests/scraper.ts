import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const stealth = StealthPlugin();
const playwright = addExtra(require('playwright')).use(stealth);

async function scrapeYouChatText() {
    const browser = await playwright.firefox.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
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

    // Output the scraped text to the console (for debugging purposes)
    console.log(scrapedText);

    // Close the incognito browser context
    await context.close();
}

scrapeYouChatText();