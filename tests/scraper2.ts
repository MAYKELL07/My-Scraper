import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';

// Add the stealth plugin
const stealth = StealthPlugin();
const recaptcha = RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: '05550eb71909e8a303ff214ee64d24fd'  // Replace with your 2Captcha API key
    },
    visualFeedback: true // Colorize solved captchas for debugging
});
const playwright = addExtra(require('playwright')).use(stealth).use(recaptcha);

async function scrapeYouChatText() {
    const browser = await playwright.firefox.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the target website
    await page.goto('https://you.com');

    await page.solveCloudflareCaptcha(); 

    // Input text into the textarea
    await page.fill('#search-input-textarea', "what's your name");

    // Press Enter
    await page.keyboard.press('Enter');

    // Wait for the response
    await page.waitForSelector('[data-testid="youchat-text"]');

    // Scrape the text
    const scrapedText = await page.textContent('[data-testid="youchat-text"]');

    // Output the scraped text to the console
    console.log(scrapedText);

    await context.close();
}

scrapeYouChatText();
